import { Document } from 'mongoose';
import { IProfile } from './profile.model';
import { inherits } from 'util';

export enum ConversionType {
    USD = 2.0,
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
    profiles: IProfile['_id'][];
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
