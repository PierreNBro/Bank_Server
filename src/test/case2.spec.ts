import { api } from "./server.spec";

describe('case 2', () => {
    let tempToken: string;
    test('for case 2', async done => {
        api
            .post('/api/auth/register')
            .send({ 'profileId': '504', 'password': '1234' })
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                tempToken = res.body.token;
                done();
            })
    });
});