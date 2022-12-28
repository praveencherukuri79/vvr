//import * as jwt from 'express-jwt';
import UserModel from '../../models/userModel';
import * as jwt from 'jsonwebtoken';
import * as express from 'express';
//import {sign, verify} from 'jsonwebtoken';
//import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { isTokenBlackListed } from './../../express-router/black-list-tokens/blck-list-tokens';
import { isDefined } from 'backend/utils/util';
import { CustomRequest, CustomResponse } from 'backend/models/expressTypes';

export const getTokenFromHeader = (req: CustomRequest): string => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1] ? req.headers.authorization.split(' ')[1] : '';
  }
  return '';
};

// export function isDefined(val: any): boolean {
//   if (val !== null && val !== undefined && typeof val !== 'undefined' && val !== '') {
//     return true;
//   }
//   return false;
// }

export const attachCurrentUser = async (req: CustomRequest, res: CustomResponse, next: express.NextFunction ) => {
  const token = getTokenFromHeader(req);
  if (!isDefined(token)) {
    return res.status(500).json({ message: 'no token available' });
  }
  if (isTokenBlackListed(token)) {
    return res.status(500).json({ message: 'Token expired or Invalid' });
  }

  try {
    const decodedUser: jwt.JwtPayload = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
    try {
      const userId = decodedUser.data._id;
      const user = await UserModel.findOne({ _id: userId });
      if (!user) {
        res.status(401).end();
      }
      req.currentUser = user;
      return next();
    } catch (e) {
      //return res.json(e).status(500);
      return res.status(500).json({ message: e.message });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }

  // const { err, decoded } = await jwt.verify(token, process.env.JWT_SECRET);
  // if (err) {
  //   console.log('error in verify', err);
  //   return res.json(err).status(500);
  // } else if (decoded) {
  //   console.log('decoded user', decoded);
  //   try {
  //     const decodedUser = decoded;
  //     const user = await UserModel.findOne({ _id: decodedUser._id });
  //     if (!user) {
  //       res.status(401).end();
  //     }
  //     req.currentUser = user;
  //     return next();
  //   } catch (e) {
  //     return res.json(e).status(500);
  //   }
  // }
};

// export const isAuth = jwt({
//   secret: process.env.JWT_SECRET,
//   userProperty: 'token', // this is where the next middleware can find the encoded data generated in services/auth:generateToken
//   getToken: getTokenFromHeader
// });

export const checkRole = (requiredRole) => {
  return (req: CustomRequest, res: CustomResponse, next: express.NextFunction) => {
    if (req.currentUser.role !== requiredRole) {
      return res.status(401).end();
    } else {
      console.log('User meet required role, going to next middleware');
      return next();
    }
  };
};

// export const attachCurrentUser = async (req: CustomRequest, res: CustomResponse, next: express.NextFunction) => {
//   try {
//     const decodedUser = req.token.data;
//     const user = await UserModel.findOne({ _id: decodedUser._id });
//     if (!user) {
//       res.status(401).end();
//     }
//     req.currentUser = user;
//     return next();
//   } catch (e) {
//     return res.json(e).status(500);
//   }
// };
