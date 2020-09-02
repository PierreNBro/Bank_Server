import { api } from "./server.spec";
import { IAccount } from "../model/account.model";

describe('case 0', () => {
    let expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNDZiMDFlZDVkZWIwMGFiNzM0Yzc4NyIsImlhdCI6MTU5ODQ2ODEyNiwiZXhwIjoxNTk4NTU0NTI2fQ.3C9Ei5mDJczh2TLuFMSnEiBqDnmlThyGUbZ-gNpkfg4'
    test('Should not be able to pull accounts', done => {
        api
            .get('/api/accounts')
            .expect('Content-Type', /json/)
            .expect(403)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.message).toBe('No token provided');
                done();
            });
    });

});