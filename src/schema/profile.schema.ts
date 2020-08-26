import mongoose, { Schema } from 'mongoose';
import { IProfile } from '../model/profile.model';

const ProfileSchema: Schema<IProfile> = new Schema({
    profileId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true, select: false },
});

export default mongoose.model<IProfile>("Profile", ProfileSchema);