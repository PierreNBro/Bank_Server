import mongoose, { Schema } from 'mongoose';
import { IAccount } from '../model/account.model';

const AccountSchema: Schema = new Schema({
    accountId: { type: String, required: true, unique: true},
    balance: { type: String, required: true },
    type: { type: String, required: true },
    profiles: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
});

export default mongoose.model<IAccount>("Account", AccountSchema);