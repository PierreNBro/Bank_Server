import fs from 'fs-extra';
import path from 'path';
import app, { DBPath } from './server';
import { config } from './config';
import mongoose from 'mongoose';

let port = config.port || process.env.PORT || 3000;
const listener = app.listen(port, () => {
    console.log(`Server on port ${port}`);
});

process.on('SIGINT' || 'SIGTERM', async () => {
    console.log("\nBegin Teardown\n");

    listener.close(async (err) => {
        if ((await DBPath).instanceInfoSync!.dbName !== undefined) {
            console.log("Clearing mongo cache...");
            fs.removeSync(path.resolve((await DBPath).instanceInfoSync!.dbName as string));
            console.log("Cache Cleared");
        }
        if (err) throw err;
        (await (await DBPath).runningInstance)!.instance.kill();
        console.log('Server stopped');
        process.exit(0);  
    });
})