export interface IConfig {
    host: string;
    port: number;
    server: IMongoMemoryServer;
    secret: string;
}

export interface IMongoMemoryServer {
    instance: IMongoMemoryInstance;
}

export interface IMongoMemoryInstance {
    ip: string;
    dbName: string;
}