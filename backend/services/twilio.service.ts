import { redisClient } from 'backend/redis/redis-client';
import { generateRandomSixDigitsNumber } from 'backend/utils/random-number';
import { createJWT, verifyJWT } from 'backend/utils/util';
import { twilioClient } from './../twilio/twilio';
const verifySid = process.env.TWILIO_VERIFY_SID;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

export default class TwilioService {
  constructor() {}

  async sendMessage(phone: string, message: string): Promise<any> {
    try {
      const data = await twilioClient.messages.create({
        from: fromPhone,
        to: phone,
        body: message
      });
      console.log('send sms message is successful');
      return data;
    } catch (e) {
      console.log('send sms message is is failed => ', e);
      throw new Error('failed to send sms message');
    }
  }

  // async sendCode(phone: string, channel: 'call' | 'sms'): Promise<any> {
  //   try {
  //     const data = await twilioClient.verify.services(verifySid).verifications.create({
  //       to: phone,
  //       channel: channel
  //     });
  //     console.log('send verification code is successful');
  //     return data;
  //   } catch (e) {
  //     console.log('send verification code is failed => ', e);
  //     throw new Error('failed to send verification code');
  //   }
  // }

  // async verifyCode(phone: string, code: string): Promise<any> {
  //   try {
  //     const data = await twilioClient.verify.services(verifySid).verificationChecks.create({
  //       to: phone,
  //       code: code
  //     });
  //     if (data.status === 'approved') {
  //       console.log('code verify is successful');
  //       return data;
  //     } else {
  //       console.log('code verify is failed');
  //       throw new Error('failed to verify code');
  //     }
  //   } catch (e) {
  //     console.log('code verify is failed => ', e);
  //     throw new Error('failed to verify code');
  //   }
  // }

  async sendCustomCode(user, phone: string): Promise<any> {
    try {
      const randomNumber = generateRandomSixDigitsNumber();
      const msgBody = `Hello ${user.name}, Your VVR verification code is: ${randomNumber}`;

      const data = await this.sendMessage(phone, msgBody); // send message

      await redisClient.set(`otp-${phone}`, `${randomNumber}`, 'EX', 600); // save in redis, expires in 10 minutes

      console.log('send verification sms code is successful');
      return data;
    } catch (e) {
      console.log('send verification sms code is failed => ', e);
      throw new Error('failed to send verification sms code');
    }
  }

  async verifyCustomCode(phone: string, code: string): Promise<any> {
    try {
      const redisKey: string = `otp-${phone}`;

      const keyExists: number = await redisClient.exists(redisKey);
      if (keyExists !== 1) {
        console.log('sms code verify is failed, probably timed out');
        throw new Error('failed to verify sms code');
      }

      const codeInRedis: string = await redisClient.get(redisKey); // retrive saved code from redis

      if (codeInRedis === code) {
        await redisClient.del(redisKey);
        console.log('sms code verify is successful, deleted from redis');
        return { message: `sms code verification is successful for - ${phone}` };
      } else {
        console.log('sms code verify is failed');
        throw new Error('failed to verify sms code');
      }
    } catch (e) {
      console.log('sms code verify is failed => ', e);
      throw new Error('failed to verify sms code');
    }
  }
}
