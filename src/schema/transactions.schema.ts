import mongoose, { Schema } from 'mongoose';
import { ITransaction } from '../model/transaction.model';

const TransactionSchema: Schema<ITransaction> = new Schema({
    accountId: { type: Schema.Types.ObjectId, required: true, ref: 'Account' },
    date: { type: Date},
    description: { type: String, required: true},
    widthrawal: { type: String},
    deposit: { type: String },
    balance: { type: String}
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);