import { Request, Response, NextFunction } from 'express';

export interface CustomRequest extends Request {
  [key: string]: any;
}

export interface CustomResponse extends Response {
    [key: string]: any;
}
