import { redisClient } from 'backend/redis/redis-client';
import { generateRandomSixDigitsNumber } from 'backend/utils/random-number';
import NodeMailer from './node-mailer';

export default class EmailOtpService {
  constructor() {}
  async sendCustomCode(user, email: string): Promise<any> {
    try {
      const randomNumber = generateRandomSixDigitsNumber();
      const data = await this.sendEmailOtp(user, randomNumber, email); // send message
      await redisClient.set(`otp-${email}`, `${randomNumber}`, 'EX', 600); // save in redis, expires in 10 minutes
      console.log('send Email verification code is successful');

      return data;
    } catch (e) {
      console.log('send Email verification code is failed => ', e);
      throw new Error('failed to send Email verification code');
    }
  }

  async verifyCustomCode(email: string, code: string): Promise<any> {
    try {
      const redisKey: string = `otp-${email}`;

      const keyExists: number = await redisClient.exists(redisKey);
      if (keyExists !== 1) {
        console.log('Email code verify is failed, probably timed out');
        throw new Error('failed to verify Email code');
      }

      const codeInRedis: string = await redisClient.get(redisKey); // retrive saved code from redis

      if (codeInRedis === code) {
        await redisClient.del(redisKey);
        console.log('Email code verify is successful, deleted from redis');
        return { message: `Email code verification is successful for - ${email}` };
      } else {
        console.log('Email code verify is failed');
        throw new Error('failed to verify Email code');
      }
    } catch (e) {
      console.log('Email code verify is failed => ', e);
      throw new Error('failed to verify Email code');
    }
  }

  getMailOptions(user, otp, email) {
    const userName = user.name;
    return {
      from: process.env.EMAIL_AUTH_USER_FROM,
      subject: 'VVR - One time passcode',
      to: `${email}`,
      text: `Hello ${userName}, Your VVR verification code is: ${otp}`,
      html: `<div>
              <h3>Hello ${userName},</h3>
              <br>
              <p>Your VVR verification code is: ${otp}</p>
    </div>`
    };
  }

  sendEmailOtp(user, otp, email) {
    const signUpMailOptions = this.getMailOptions(user, otp, email);
    const nodeMailerInstance = new NodeMailer(signUpMailOptions);
    nodeMailerInstance
      .sendMail()
      .then((result) => console.log('OTP Email sent...', result))
      .catch((error) => console.log(error.message));
  }
}
