import { Request, Response } from 'express';
import { ITransaction } from '../model/transaction.model';
import Transaction from '../schema/transactions.schema';
import { ConversionType } from '../model/account.model';
import Account from '../schema/account.schema';
import mongoose from 'mongoose';

export async function createTransaction(req: Request, res: Response) {
    try {
        const c = req.query.currency as 'MXN' | 'USD' | 'CA';
        const currencyType: number = ConversionType[c];
        const accountId = req.body.accountId;

        const account = await Account.findOne({ accountId }, '_id balance');

        let a = account?.balance;

        if (req.body.deposit !== undefined && req.body.deposit !== null && req.body.deposit !== '') {
            console.log("Before Balance: ", a);
            a = (parseFloat(a as string) + parseFloat(convertCurrency(req.body.deposit, currencyType))).toFixed(2);
            console.log("After Deposit Balace: ", a);
            account?.updateOne({ balance: a }).exec();
        }

        if (req.body.widthrawal !== undefined && req.body.widthrawal !== null && req.body.widthrawal !== '') {
            console.log("Before Balance: ", a);
            a = (parseFloat(a as string) - parseFloat(convertCurrency(req.body.widthrawal, currencyType))).toFixed(2);
            console.log("After Widthrawal Balace: ", a);
            account?.updateOne({ balance: a }).exec();
        }

        console.log(`Account id: ${account?.id}`);

        const data: ITransaction = req.body;
        await Transaction.create({
            accountId: account?.id,
            description: data.description,
            widthrawal: data.widthrawal,
            deposit: data.deposit,
            balance: a
        });

        console.log("Transaction: ", data.toString());

        console.log('transaction completed');

        res.status(201).json({ message: "Transaction record created" });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
}

export async function getAllTransactions(req: Request | any, res: Response) {
    try {
        const account = await Account.findOne({ accountId: req.body.accountId }, '_id');
        const transactions: ITransaction[] = await Transaction.find({
            accountId: account?._id
        }, '-_id -__v').exec();

        console.log(`All Transactions: ${transactions}`);

        res.status(200).json({ transactions: transactions});
    } catch (e) {
        res.json({ message: e.message });
    }
}

function convertCurrency(amount: string, currency: ConversionType) {
    return (parseFloat(amount) * currency).toFixed(2);
}
