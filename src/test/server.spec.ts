import { Server } from 'http';
import app, { DBPath } from '../server';
import fs from 'fs-extra';
import path from 'path';
import mongoose from 'mongoose';
import request from 'supertest';

export let listener: Server;
export let api: request.SuperTest<request.Test>;

beforeAll(done => {
    jest.setTimeout(30000);
    listener = app.listen(5000, () => {
        console.log("Server on port 5000");
        api = request(listener);
        done();
    }); 
});

afterAll(done => {
    listener.close(async (err) => {
        if (err) return done(err);
        if ((await DBPath).instanceInfoSync!.dbName !== undefined) {
            fs.removeSync(path.resolve((await DBPath).instanceInfoSync!.dbName));
        }
        await mongoose.connection.close();
        (await (await DBPath).runningInstance)!.instance.kill();
        console.log('Server stopped');
        done();
    });

});

test('connection', () => {
    console.log('connected');
});