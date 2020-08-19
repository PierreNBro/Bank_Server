import fs from 'fs-extra';
import path from 'path';
import { IConfig } from './model/config.model';
import { IBankInformation } from './model/account.model';

const conf: string = fs.readFileSync(path.resolve("src/config/config.json"), 'utf8');
export const config: IConfig = JSON.parse(conf);

const accountInformation: string = fs.readFileSync(path.resolve("src/config/accounts.json"), 'utf8');
export const accountInfo: IBankInformation[] = JSON.parse(accountInformation);