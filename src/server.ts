import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as db from './schema/index'
import { register, login } from './controllers/auth.controller';
import { getAllAccounts, getAccount } from './controllers/account.controller';
import { createTransaction, getAllTransactions } from './controllers/transaction.controller';
import { verifyToken } from './middleware/auth.middleware';
import { config } from './config';

const app = express();

let corsOptions = {
    origin: 'http://localhost:8000'
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

export const DBPath = db.default();

// Routes
const api = express.Router();

api.post('/auth/signin',login);
api.post('/auth/register', register);
api.get('/accounts', verifyToken, getAllAccounts);
api.get('/accounts/:accountId', verifyToken, getAccount);
api.get('/accounts/transaction', verifyToken, getAllTransactions);
api.post('/accounts/transaction', verifyToken, createTransaction);

app.use('/api', api);

export default app;