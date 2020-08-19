import { Document } from 'mongoose';
import { IProfile } from './profile.model';

export enum ConversionType {
    USD = 1.5,
    CA = 1,
    MXN = .10
}

export enum AccountType {
    PRIMARY = "PRIMARY",
    JOINT = "JOINT"
}

export interface IAccount extends Document {
    accountId: string;
    balance: string;
    type: AccountType.PRIMARY | AccountType.JOINT;
}

export interface IBankInformation {
    id: string;
    name: string;
    accounts: IAccountInformation[];
    jointAccounts: IAccountInformation[];
}

export interface IAccountInformation {
    id: string;
    balance: string;
}