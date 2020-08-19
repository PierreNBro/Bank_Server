import mongoose, { ConnectionOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from '../config';

const mongod: MongoMemoryServer = new MongoMemoryServer(config.server);

export default async () => {

    try {
        mongoose.Promise = Promise;
        const uri = await mongod.getUri();

        const mongooseOpts: ConnectionOptions = {
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }
        
        await mongoose.connect(uri, mongooseOpts);
        mongoose.connection.on('error', async (e) => {
            if (e.message.code === 'ETIMEDOUT') {
                console.error(e);
                await mongoose.connect(uri, mongooseOpts);
            }
            console.error(e);
        })

        const connInfo = mongod.instanceInfoSync;
        console.log(' Connection Details:');
        console.log(` DB Name: ${connInfo?.dbName}`);
        console.log(` DB Path: ${connInfo?.dbPath}`);
        console.log(` DB Port: ${connInfo?.port}`);
        return mongod;
    } catch (e) {
        console.log("Failed to connect to Database");
        process.exit();
    }
};

