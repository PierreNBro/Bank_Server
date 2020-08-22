import { api } from "./server.spec";
import { IAccount } from "../model/account.model";

describe('case 2', () => {
    let tempToken: string;
    test('Register Glen Quagmire\'s account', done => {
        api
            .post('/api/auth/register')
            .send({ 'profileId': '504', 'password': '1234' })
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                tempToken = res.body.token;
                done();
            });
    });

    test.todo('Login as Glen Quagmire');

    test('Glen Quagmire widthdraws $5,000.00 MXN from account 2001', done => {
        const mockData = {
            'accountId': '2001',
            'description': 'Widthdraw',
            'widthrawal': '5000.00'
        };
        api
            .post('/api/accounts/transaction')
            .set('Authorization', tempToken)
            .query({ 'currency': 'MXN' })
            .send(mockData)
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.message).toBe('Transaction record created');
                done();
            });

    });

    test('Glen Quagmire account balance after widthrawal', done => {
        api
            .get('/api/accounts')
            .set('Authorization', tempToken)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) done(err);
                let accounts: IAccount[] = res.body.accounts;
                let account: IAccount | undefined = accounts.find(account => account.accountId === '2001');
                expect(account!.balance).toBe('34500.00');
                done();
            });
    });

    test('Glen Quagmire widthdraws $12,500.00 USD from account 2001', async done => {
        const mockData = {
            'accountId': '2001',
            'description': "Widthrawal",
            'widthrawal': '12500.00'
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

    test('Glen Quagmire account balance after widthrawal', async done => {
        api
            .get('/api/accounts')
            .set('Authorization', tempToken)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) done(err);
                let accounts: IAccount[] = res.body.accounts;
                let account: IAccount | undefined = accounts.find(account => account.accountId === '2001');
                console.log(`Balance: ${account!.balance}`);
                expect(account!.balance).toBe('9500.00');
                done();
            });
    });

test.todo('Glen Quagmire deposits $300.00 CA to account 2001');

test.todo('Glen Quagmire account balance');

});