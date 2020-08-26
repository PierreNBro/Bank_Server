import { api } from "./server.spec";

describe('case 5', () => {
    let tokenForJoe: string;
    let tokenForJohn: string;
    test('Register Joe Swanson account', done => {
        api
            .post('/api/auth/register')
            .send({ 'profileId': '002', 'password': 'Thisisjoe' })
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) done(err);
                tokenForJoe = res.body.token;
                done();
            });
    });

    test('Register John Shark\'s account', done => {
        api
            .post('/api/auth/register')
            .send({ 'profileId': '219', 'password': '1234' })
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) done(err);
                tokenForJohn = res.body.token;
                done();
            });
    });
    

    test('John tries to widthraw from joes account using same account id', done => {
        const mockData = {
            'accountId': '1010',
            'description': 'Widthdraw',
            'widthrawal': '100.00'
        };
        api
            .post('/api/accounts/transaction')
            .set('Authorization', tokenForJohn)
            .query({ 'currency': 'USD' })
            .send(mockData)
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.message).toBe('Cannot make changes to this account');
                done();
            }); 
    });
});