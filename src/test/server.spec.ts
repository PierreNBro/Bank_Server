import { Server } from 'http';
import app, { DBPath } from '../server';
import fs from 'fs-extra';
import path from 'path';
import mongoose from 'mongoose';
import request from 'supertest';

export let listener: Server;
export let api: request.SuperTest<request.Test>;

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

test('Server is running', async done => {
    console.log('connected');
    done();
});
