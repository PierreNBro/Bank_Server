import { api } from "./server.spec";

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
    
    test.todo('Peter Griffin widthdraws $70.00 USD from account 0456');
    test.todo('Check balance for account 0456');
    test.todo('Lois Griffin deposits 23,789.00 USD to account number 0456');
    test.todo('Check balance for account 0456');
    test.todo('Lois Griffin transfers $23.75 CAD from 0456 to 0123');
    test.todo('Check balance for accounts 0456 and 0123');
});