import { Request, Response } from 'express';
import { IProfile } from '../model/profile.model';
import Profile from '../schema/profile.schema';
import Account from '../schema/account.schema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { accountInfo, config } from '../config';
import { IAuthRequest } from '../model/auth.model';
import { IBankInformation, IAccountInformation, IAccount, AccountType } from '../model/account.model'

export async function register(req: Request, res: Response): Promise<void> {

    try {
        const data: IAuthRequest = req.body;

        // Check to see if the user has an account with the bank
        const account: IBankInformation | undefined = accountInfo.find(account => account.id === data.profileId);
        if (account === undefined) {
            res.status(400);
            throw new Error("There is no rejesterd account with this number");
        }


        const newPrimaryAccounts = account.accounts.map((value: IAccountInformation, index: number, arr: IAccountInformation[]) => {
            return {
                accountId: value.id,
                balance: value.balance,
                type: AccountType.PRIMARY,
            };
        })



        const primaryAccounts = await Account.create(newPrimaryAccounts);
        let jointAccounts;
        if (account.jointAccounts !== undefined && account.jointAccounts?.length > 0) {
            const newJointAccount: any[] = account.jointAccounts.map((value: IAccountInformation, index: number, arr: IAccountInformation[]) => {
                return {
                    accountId: value.id,
                    balance: value.balance,
                    type: AccountType.JOINT,
                };
            })
            jointAccounts = await Account.create(newJointAccount);
        }

        const doc = await Profile.create({
            profileId: data.profileId,
            name: account.name,
            password: bcrypt.hashSync(data.password),
            accounts: primaryAccounts,
            jointAccounts: jointAccounts
        });

        const token: string = jwt.sign({ id: doc.id }, config.secret, {
            expiresIn: 86400
        });

        res.status(201).json({ token: token });
    } catch (e) {
        res.json({ message: e.message });
    }
}

export async function login(req: Request, res: Response): Promise<void> {
    try {
        const data: IAuthRequest = req.body;

        const profile = await Profile.findOne({
            profileId: data.profileId
        }, '-_id -__v +password').populate('Accounts')

        if (profile === null) {
            res.status(404);
            throw new Error("This account does not exist");
        }

        const passwordIsValid = bcrypt.compareSync(
            data.password,
            profile.password as string
        );

        if (!passwordIsValid) {
            res.status(401);
            throw new Error("Invalid Password");
        }

        const token: string = jwt.sign({ id: profile.id }, config.secret, {
            expiresIn: 900
        });

        res.status(200).json({ token });

    } catch (e) {
        res.json({ message: e.message });
    }
}