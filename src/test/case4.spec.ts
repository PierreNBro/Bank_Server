import { api } from "./server.spec";
import { IAccount } from "../model/account.model";

describe('case 4', () => {
    let tokenForPeter: string;
    let tokenForLois: string;
    test('Register account for Peter Griffin', done => {
        api
            .post('/api/auth/register')
            .send({ 'profileId': '123', 'password': '1234' })
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                tokenForPeter = res.body.token;
                done();
            });
    });

    test('Register account for Lois Griffin', done => {
        api
            .post('/api/auth/register')
            .send({ 'profileId': '456', 'password': '1234' })
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                tokenForLois = res.body.token;
                done();
            });
    });

    test('Peter Griffin widthdraws $70.00 USD from account 0456', done => {
        const mockData = {
            'accountId': '0123',
            'description': 'Widthdraw',
            'widthrawal': '70.00'
        };
        api
            .post('/api/accounts/transaction')
            .set('Authorization', tokenForPeter)
            .query({ 'currency': 'USD' })
            .send(mockData)
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.message).toBe('Transaction record created');
                done();
            });
    });
    test('Check balance for account 0456', done => {
        api
            .get('/api/accounts')
            .set('Authorization', tokenForPeter)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) done(err);
                let accounts: IAccount[] = res.body.accounts;
                let account: IAccount | undefined = accounts.find(account => account.accountId === '0123');
                expect(account!.balance).toBe('10.00');
                done();
            });
    });
    test('Lois Griffin deposits 23,789.00 USD to account number 0456', done => {
        const mockData = {
            'accountId': '0456',
            'description': "deposit",
            'deposit': '23789.00'
        }
        api
            .post('/api/accounts/transaction')
            .set('Authorization', tokenForLois)
            .query({ 'currency': 'USD' })
            .send(mockData)
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.message).toBe('Transaction record created');
                done();
            });
    });
    test('Check balance for account 0456', done => {
        api
            .get('/api/accounts')
            .set('Authorization', tokenForLois)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) done(err);
                let accounts: IAccount[] = res.body.accounts;
                let account: IAccount | undefined = accounts.find(account => account.accountId === '0456');
                expect(account!.balance).toBe('112578.00');
                done();
            });
    });
    test('Lois Griffin transfers $23.75 CAD from 0456 to 0123', done => {
        const transferToData = {
            'accountId': '0123',
            'description': 'Transfer from: 0456',
            'deposit': '23.75'
        };

        const transferFromData = {
            'accountId': '0456',
            'description': 'Transfer to: 0123',
            'widthrawal': '23.75'
        };

        api
            .post('/api/accounts/transaction')
            .set('Authorization', tokenForLois)
            .query({ 'currency': 'CA' })
            .send(transferToData)
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.message).toBe('Transaction record created');
                done();
            });

        api
            .post('/api/accounts/transaction')
            .set('Authorization', tokenForLois)
            .query({ 'currency': 'CA' })
            .send(transferFromData)
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.message).toBe('Transaction record created');
                done();
            });
    });
    test('Check balance for accounts 0456', done => {
        api
        .get('/api/accounts')
        .set('Authorization', tokenForPeter)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            if (err) done(err);
            let accounts: IAccount[] = res.body.accounts;
            let account: IAccount | undefined = accounts.find(account => account.accountId === '0123');
            console.log(`Balance: ${account!.balance}`);
            expect(account!.balance).toBe('33.75');
            done();
        });
    });

    test('Check balance for accounts 0123', done => {
        api
        .get('/api/accounts')
        .set('Authorization', tokenForLois)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            if (err) done(err);
            let accounts: IAccount[] = res.body.accounts;
            let account: IAccount | undefined = accounts.find(account => account.accountId === '0456');
            console.log(`Balance: ${account!.balance}`);
            expect(account!.balance).toBe('112554.25');
            done();
        });
    });
});