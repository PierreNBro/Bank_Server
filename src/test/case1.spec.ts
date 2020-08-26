import { api } from "./server.spec";
import { IAccount } from "../model/account.model";

describe('Case 1', () => {
    let tempToken: string;
    test('Register Stewie Griffin Account', done => {
        api
            .post('/api/auth/register')
            .send({ 'profileId': '777', 'password': '1234' })
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) done(err);
                tempToken = res.body.token;
                done();
            });
    });

    test('Login as Stewie Griffin wrong password', done => {
        api
            .post('/api/auth/login')
            .send({ 'profileId': '777', 'password': '123456' })
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.message).toBe('Invalid Password');
                done();
            });
    });

    test('Login as an unregistered account', done => {
        api
            .post('/api/auth/login')
            .send({ 'profileId': '403', 'password': '1234' })
            .expect('Content-Type', /json/)
            .expect(404)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.message).toBe('No Registered Account');
                done();
            });
    });

    test('Login as Stewie Griffin', done => {
        api
            .post('/api/auth/login')
            .send({ 'profileId': '777', 'password': '1234' })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                console.log(`Error: ${err}`);
                if (err) done(err);
                tempToken = res.body.token;

                done();
            });
    });

    test('Stewie Griffin deposits 300 USD', done => {
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
                if (err) done(err);
                expect(res.body.message).toBe('Transaction record created');
                done();
            });
    });

    test('Stewie Griffin\'s new account balance for account 1234', done => {
        api
            .get('/api/accounts')
            .set('Authorization', tempToken)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) done(err);
                let accounts: IAccount[] = res.body.accounts;
                let account: IAccount | undefined = accounts.find(account => account.accountId === '1234');
                console.log(`Balance: ${account!.balance}`);
                expect(account!.balance).toBe('700.00');
                done();
            });
    });
});