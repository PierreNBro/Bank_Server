import { Server } from 'http';
import app, { DBPath } from './server';
import fs from 'fs-extra';
import path from 'path';
import mongoose from 'mongoose';
import request from 'supertest';
import { IAccount } from './model/account.model';

let listener: Server;
let api: request.SuperTest<request.Test>;
beforeAll(async done => {
    listener = app.listen(5000, () => {
        console.log("Server on port 5000");
        done();
    });
    api = request(listener);
});

afterAll(async done => {
    listener.close(async (err) => {
        if ((await DBPath).instanceInfoSync!.dbName !== undefined) {
            console.log("Clearing mongo cache...");
            fs.removeSync(path.resolve((await DBPath).instanceInfoSync!.dbName as string));
            console.log("Cache Cleared");
        }
        if (err) throw err;
        await mongoose.connection.close();
        (await (await DBPath).runningInstance)!.instance.kill();
        console.log('Server stopped');
        done();
    });

});
describe('Case 1', () => {
    let tempToken: string;
    test('Register Stewie Griffin Account', async done => {
        api
            .post('/api/auth/register')
            .send({ 'profileId': '777', 'password': '1234' })
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                tempToken = res.body.token;
                done();
            })
    });

    test('Stewie Griffin deposits 300 USD', async done => {
        const mockData = {
            'accountId': '1234',
            'description': "Deposit",
            'deposit': '300.00'
        }
        api
            .post('/api/accounts/transaction')
            .set('Authorization', tempToken)
            .query({ 'currency': 'USD' })
            .send(mockData)
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.message).toBe('Transaction record created');
                done();
            })
    });

    test('Stewie Griffin\'s new account balance for account 1234', async done => {
        api
            .get('/api/account')
            .set('Authorization', tempToken)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done();
                let accounts: IAccount[] = res.body.accounts;
                let account: IAccount | undefined = accounts.find(account => account.accountId === '1234');
                expect(account!.balance).toBe('550.00');
            })

    });

});

describe('case 2', () => {
    test('for case 1', async done => {
        done();
    });
});

describe('case 3', () => {
    test('for case 1', async done => {
        done();
    });
});

describe('case 4', () => {
    test('for case 1', async done => {
        done();
    });
});

describe('case 5', () => {
    test('for case 1', async done => {
        done();
    });
});


