import { Request, Response } from 'express';
import Account from '../schema/account.schema';
import { IAccount } from '../model/account.model';
import mongoose from 'mongoose';


export async function getAllAccounts(req: Request | any, res: Response): Promise<void> {
    try {
        const accounts: IAccount[] | null = await Account.find({
            profiles:   mongoose.Types.ObjectId((req as any).token as string)
        });

        console.log(`Accounts: ${accounts}`);

        res.status(200).json({accounts: accounts});
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
}
