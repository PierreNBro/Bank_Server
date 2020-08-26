import { Document } from 'mongoose';
import { IAccount } from './account.model';

export interface IProfile extends Document {
    profileId: string;
    name: string;
    password?: string;
}