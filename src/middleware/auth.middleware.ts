import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IAuthError } from '../model/auth.model';
import { config } from '../config';
import Profile from '../schema/profile.schema';
import { IProfile } from '../model/profile.model';

export function verifyToken(req: Request | any, res: Response<IAuthError>, next: NextFunction): Response<IAuthError> | undefined {
    let token: string | undefined = req.headers.authorization?.toString();

    if (!token) {
        return res.status(403).json({ message: "No token provided" } as IAuthError);
    }

    jwt.verify(token, config.secret, async (err, decoded: any) => {
        if (err) return res.status(401).json({ message: "Unauthorized" } as IAuthError);
        req.token = decoded.id as string;


        // Simulate blacklisted tokens
        try {
            const profile: IProfile | null = await Profile.findOne({
                _id: req.token as any
            }, '_id');

            if (profile === null || profile === undefined) {
                res.status(401);
                throw new Error('This token is no longer valid');
            }
        } catch(e) {
            return res.json({ message: e.message });
        }
            
        next();
    })
}