import { api } from "./server.spec";
import { IAccount } from "../model/account.model";

describe('case 3', () => {
    let tempToken: string;
    test('Register Joe Swanson\'s account', done => {
        api
            .post('/api/auth/register')
            .send({ 'profileId': '002', 'password': '1234' })
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) done(err);
                tempToken = res.body.token;
                done();
            });
    });
    test('Joe Swanson widthdraws $5000.00 CAD from account 5500', done => {
        const mockData = {
            'accountId': '5500',
            'description': 'Widthdraw',
            'widthrawal': '5000.00'
        };
        api
            .post('/api/accounts/transaction')
            .set('Authorization', tempToken)
            .query({ 'currency': 'CA' })
            .send(mockData)
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.message).toBe('Transaction record created');
                done();
            });
    });
    test('Joe Swanson account balance for 5500', done => {
        api
            .get('/api/accounts')
            .set('Authorization', tempToken)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) done(err);
                let accounts: IAccount[] = res.body.accounts;
                let account: IAccount | undefined = accounts.find(account => account.accountId === '5500');
                expect(account!.balance).toBe('10000.00');
                done();
            });
    });

    test('Joe Swanson transfers $7,300.00 CAD from account 1010 to 5500', done => {
        const transferToData = {
            'accountId': '5500',
            'description': 'Transfer from: 1010',
            'deposit': '7300.00'
        };
        
        const transferFromData = {
            'accountId': '1010',
            'description': 'Transfer to: 5500',
            'widthrawal': '7300.00'
        };
        api
            .post('/api/accounts/transaction')
            .set('Authorization', tempToken)
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
            .set('Authorization', tempToken)
            .query({ 'currency': 'CA' })
            .send(transferFromData)
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.message).toBe('Transaction record created');
                done();
            });
    } );
    test('Joe Swanson account balances for 5500', done => {
        api
            .get('/api/accounts')
            .set('Authorization', tempToken)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) done(err);
                let accounts: IAccount[] = res.body.accounts;
                let account: IAccount | undefined = accounts.find(account => account.accountId === '5500');
                console.log(`Balance: ${account!.balance}`);
                expect(account!.balance).toBe('17300.00');
                done();
            });
    });

    test('Joe Swanson account balances for 1010', done => {
        api
        .get('/api/accounts')
        .set('Authorization', tempToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            if (err) done(err);
            let accounts: IAccount[] = res.body.accounts;
            let account: IAccount | undefined = accounts.find(account => account.accountId === '1010');
            console.log(`Balance: ${account!.balance}`);
            expect(account!.balance).toBe('125.00');
            done();
        });
    });

    test('Joe Swanson deposits $13,726.00 MXN to account 1010', done => {
        const mockData = {
            'accountId': '1010',
            'description': "deposit",
            'deposit': '13725.00'
        }
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
    test('Joe Swanson account balance for 1010', done => {
        api
        .get('/api/accounts')
        .set('Authorization', tempToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            if (err) done(err);
            let accounts: IAccount[] = res.body.accounts;
            let account: IAccount | undefined = accounts.find(account => account.accountId === '1010');
            console.log(`Balance: ${account!.balance}`);
            expect(account!.balance).toBe('1497.50');
            done();
        });
    });
});