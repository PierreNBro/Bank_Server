import { Document } from 'mongoose';
import { IAccount } from './account.model';

export interface ITransaction extends Document{
    accountId?: IAccount['_id'];
    date?: Date;
    description: string;
    widthrawal?: string;
    deposit?: string;
    balance?: string;
}