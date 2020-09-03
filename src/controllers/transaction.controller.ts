import { Request, Response } from 'express';
import { ITransaction } from '../model/transaction.model';
import Transaction from '../schema/transactions.schema';
import { ConversionType, IAccount } from '../model/account.model';
import Account from '../schema/account.schema';
import Profile from '../schema/profile.schema';
import mongoose from 'mongoose';


export async function createTransaction(req: Request, res: Response) {
    try {
        const c = req.query.currency as 'MXN' | 'USD' | 'CA';
        const currencyType: number = ConversionType[c];
        const accountId = req.body.accountId;

        
        const accounts = await Account.find({ profiles: (req as any).token });
        if (accounts === undefined || accounts.length <= 0) {
            throw new Error("Cannot make changes to this account");
        }
        const account = accounts.find(account => account.accountId === accountId);
        // const account = (profile?.accounts as IAccount[]).find((val, i) => val._id === accountId);
        // if (account === undefined) throw new Error('Account does not exist for this user');
        
        let a = account?.balance;

        if (req.body.deposit !== undefined && req.body.deposit !== null && req.body.deposit !== '') {
            a = (parseFloat(a as string) + parseFloat(convertCurrency(req.body.deposit, currencyType))).toFixed(2);
            account?.updateOne({ balance: a }).exec();
            // account.balance = a;
        }

        if (req.body.widthrawal !== undefined && req.body.widthrawal !== null && req.body.widthrawal !== '') {
            a = (parseFloat(a as string) - parseFloat(convertCurrency(req.body.widthrawal, currencyType))).toFixed(2);
            account?.updateOne({ balance: a }).exec();
            // account.balance = a;
        }

        const data: ITransaction = req.body;
        await Transaction.create({
            accountId: account?.id,
            description: data.description,
            widthrawal: data.widthrawal,
            deposit: data.deposit,
            balance: a
        });

        res.status(201).json({ message: "Transaction record created" });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
}

export async function getAllTransactions(req: Request | any, res: Response) {
    try {
        const account = await Account.findOne({ accountId: req.params.accountId }, '_id');
        const transactions: ITransaction[] = await Transaction.find({
            accountId: account?._id
        }, '-_id -__v').exec();

        res.status(200).json({ transactions: transactions});
    } catch (e) {
        console.log(`Error: ${e.message}`);
        res.status(400).json({ message: e.message });
    }
}

function convertCurrency(amount: string, currency: ConversionType) {
    return (parseFloat(amount) * currency).toFixed(2);
}
