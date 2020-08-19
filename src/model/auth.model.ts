import { IProfile } from "./profile.model";
import { Document } from 'mongoose';
import { Request } from 'express';

export interface CustomRequest extends Request {
    token: string;
}

export interface IAuthError {
    message: string;
}

export interface IAuthRequest extends Document {
    profileId: string,
    password: string;
}
