import * as express from 'express';
import { CustomRequest, CustomResponse } from 'backend/models/expressTypes';
import TwilioService from 'backend/services/twilio.service';
import { createJWT, verifyJWT } from 'backend/utils/util';
import EmailOtpService from 'backend/nodemailer/email-otp.service';
import AuthService from 'backend/services/auth.service';

const app = express();

app.post('/twilio/sendMessage', async (req: CustomRequest, res: CustomResponse) => {
  try {
    const body = req.body;
    const twilioService = new TwilioService();
    const data = await twilioService.sendMessage(body.phone, body.message);
    return res.status(200).send(data);
  } catch (e) {
    console.log('Error sending sms ', e.message);
    return res.status(500).json({ message: e.message });
  }
});

// app.post('/twilio/sendOtp', async (req: CustomRequest, res: CustomResponse) => {
//   try {
//     const body = req.body;
//     const twilioService = new TwilioService();
//     const data = await twilioService.sendCode(body.phone, body.channel);
//     const token = createJWT({ phone: body.phone, data: data }, process.env.JWT_TWILIO_SECRET, '10m');
//     return res.status(200).send({ token });
//   } catch (e) {
//     console.log('Error sending otp ', e.message);
//     return res.status(500).json({ message: e.message });
//   }
// });

// app.post('/twilio/verifyOtp', async (req: CustomRequest, res: CustomResponse) => {
//   try {
//     const body = req.body;
//     const decodedJwt = verifyJWT(body.token, process.env.JWT_TWILIO_SECRET);
//     if (!decodedJwt || !decodedJwt.phone) {
//       console.log('code verify is failed');
//       return res.status(500).json({ message: 'Invalid token' });
//     }
//     const twilioService = new TwilioService();
//     const data = await twilioService.verifyCode(decodedJwt.phone, body.code);
//     return res.status(200).send(data);
//   } catch (e) {
//     console.log('Error verifying otp ', e.message);
//     return res.status(500).json({ message: e.message });
//   }
// });

app.post('/twilio/sendOtp', async (req: CustomRequest, res: CustomResponse) => {
  try {
    const body = req.body;
    let data;
    let JWTPlaylod;

    const authServiceInstance = new AuthService();
    const userRecord = await authServiceInstance.findUserforOTP(body);
    const user = userRecord.user;
    if(!user){
      console.log('Error sending otp - no user found');
      return res.status(500).json({ message: 'Error sending otp - no user found' });
    }
    
    if(body.channel === 'sms'){
      const twilioService = new TwilioService();
      data = await twilioService.sendCustomCode(user, body.phone);
      JWTPlaylod = {phone: body.phone, channel: body.channel}
    } else if(body.channel === 'email'){
      const emailOtpService = new EmailOtpService();
      data = await emailOtpService.sendCustomCode(user, body.email);
      JWTPlaylod = {email: body.email, channel: body.channel}
    } else{
      return res.status(500).json({ message: 'Invalid Channel' });
    }
    
    const token = createJWT(JWTPlaylod, process.env.JWT_TWILIO_SECRET, '10m');
    return res.status(200).send({ token });
  } catch (e) {
    console.log('Error sending otp ', e.message);
    return res.status(500).json({ message: e.message });
  }
});

app.post('/twilio/verifyOtp', async (req: CustomRequest, res: CustomResponse) => {
  try {
    const body = req.body;
    let data;
    const decodedJwt = verifyJWT(body.token, process.env.JWT_TWILIO_SECRET);
    if (!decodedJwt || (decodedJwt.channel === 'sms' && !decodedJwt.phone) || (decodedJwt.channel === 'email' && !decodedJwt.email)) {
      console.log('code verify is failed');
      return res.status(500).json({ message: 'Invalid token' });
    }

    if(decodedJwt.channel === 'sms'){
      const twilioService = new TwilioService();
      data = await twilioService.verifyCustomCode(decodedJwt.phone, body.code);
    } else if(decodedJwt.channel === 'email'){
      const emailOtpService = new EmailOtpService();
      data = await emailOtpService.verifyCustomCode(decodedJwt.email, body.code);
    } else{
      return res.status(500).json({ message: 'Invalid Channel' });
    }
    return res.status(200).send(data);
  } catch (e) {
    console.log('Error verifying otp ', e.message);
    return res.status(500).json({ message: e.message });
  }
});

export default app;
