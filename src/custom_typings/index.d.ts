import * as express from "express"

declare module "express" { 
  export interface Request {
    token?: string;
  }
}