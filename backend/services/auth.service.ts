//import * as argon2 from 'argon2';
//const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');
//import { randomBytes } from 'crypto';
import UserModel from '../models/userModel';
import * as jwt from 'jsonwebtoken';
import { setBlackListTokens } from './../express-router/black-list-tokens/blck-list-tokens';
import { getUserReturnData } from 'backend/utils/util';
import { sendSignupEmail } from 'backend/nodemailer/signup-success-email';
import * as mongoose from 'mongoose';

const MongooseId = mongoose.Types.ObjectId;

export default class AuthService {
  constructor() {}

  async Login(email: string, password: string): Promise<any> {
    const userRecord = await UserModel.findOne({ email });
    if (!userRecord) {
      throw new Error('User not found');
    }else {
      // const isPasswordMatch = await argon2.verify(userRecord.password, password);
      const isPasswordMatch = await bcrypt.compare(password, userRecord.password);
      if (!isPasswordMatch) {
        throw new Error('Incorrect password');
      }
      if(userRecord.role !== 'admin' && !userRecord.adminApproved){
        throw new Error('Pending Admin Approval');
      }
    }
    console.log('loggenin user => ', userRecord.email);
    return getUserReturnData(userRecord, this.generateJWT(userRecord))
  }

  async LogOut(token: string) {
    return setBlackListTokens(token);
  }

  async LoginAs(email: string): Promise<any> {
    const userRecord = await UserModel.findOne({ email });
    console.log('Finding user record...');
    if (!userRecord) {
      throw new Error('User not found');
    }
    console.log('user found => ', userRecord.email);
    return getUserReturnData(userRecord, this.generateJWT(userRecord));
  }

  async SignUp(user): Promise<any> {
    const isUserExist = await UserModel.findOne({ email: user.email });
    if (isUserExist) {
      throw new Error('User Email already exist');
    }
    //const salt = randomBytes(32);
    //const passwordHashed = await argon2.hash(password, { salt });
    const passwordHashed = await bcrypt.hash(user.password, 10);

    const userRecord = await UserModel.create({
      password: passwordHashed,
      email: user.email,
      phone: user.phone,
      //salt: salt.toString('hex'),
      name: user.name
    });
    //const token = this.generateJWT(userRecord);
    sendSignupEmail(userRecord);
    return getUserReturnData(userRecord, '');
  }

  async getAllUsers(): Promise<any> {
    const userRecord = await UserModel.find({role: 'user'},{password:0});
    return userRecord;
  }

  async approveUser(user): Promise<any> {
    try {
      const data = await UserModel.findOneAndUpdate({ email: user.email, _id: new MongooseId(user._id) }, {adminApproved: true}, {
        new: true,
        runValidators: true
      });
      console.log(`admin approval is success for ${user.email}`);
      return getUserReturnData(data);
    }catch(e){
      console.log(`failed to approve user ${user.email}`, e);
      throw new Error(`failed to approve user ${user.email}`);
    }
  }

  async unApproveUser(user): Promise<any> {
    try {
      const data = await UserModel.findOneAndUpdate({ email: user.email, _id: new MongooseId(user._id) }, {adminApproved: false}, {
        new: true,
        runValidators: true
      });
      console.log(`admin un-approval is success for ${user.email}`);
      return getUserReturnData(data);
    }catch(e){
      console.log(`failed to un-approve user ${user.email}`, e);
      throw new Error(`failed to un-approve user ${user.email}`);
    }
  }

  async deleteUser(user): Promise<any> {
    try {
      const data = await UserModel.findOneAndDelete({ email: user.email, _id: new MongooseId(user._id) });
      console.log(`user deletion is success for ${user.email}`);
      return getUserReturnData(data);
    }catch(e){
      console.log(`failed to delete user ${user.email}`, e);
      throw new Error(`failed to delete user ${user.email}`);
    }
  }

  async findUserforOTP(reqBody): Promise<any> {
    try {
      const findQuery = reqBody.channel == 'email' ? { email: reqBody.email }: {phone: reqBody.phone};
      const data = await UserModel.findOne(findQuery, {password:0});
      console.log(`user found`);
      return getUserReturnData(data);
    }catch(e){
      console.log(`user not found`, e);
      throw new Error(`user not found`);
    }
  }

  async changePassword(userData, password): Promise<any> {
    try {
      const findQuery = userData.channel == 'email' ? { email: userData.email }: {phone: userData.phone};
      const passwordHashed = await bcrypt.hash(password, 10);
      const data = await UserModel.findOneAndUpdate(findQuery, {password: passwordHashed}, {
        new: true,
        runValidators: true
      });
      console.log(`change password is success`);
      //delete data.password;
      return getUserReturnData(data);
    }catch(e){
      console.log(`failed to change password`, e);
      throw new Error(`failed to change password`);
    }
  }


  private generateJWT(user: any) {
    return jwt.sign(
      {
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    ); // @TODO move this to an env var
  }
  //process.env.JWT_EXPIRY
}
