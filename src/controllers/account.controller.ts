import { Request, Response } from 'express';
import Profile from '../schema/profile.schema';
import { IProfile } from '../model/profile.model';

export async function getAllAccounts(req: Request | any, res: Response): Promise<void> {
    try {
        const profile: IProfile | null = await Profile.findOne({
            _id: req.token as any
        }, '+accounts +jointAccounts -_id -__v -name -profileId')
            .populate('accounts jointAccounts', '-__v -_id');

        res.json(profile);
    } catch (e) {
        res.json({ message: e.message });
    }
}
