import AuthService from '../../../services/auth.service';
import { checkRole, attachCurrentUser, getTokenFromHeader } from '../../express-middleware/middleware';
import * as express from 'express';
import { CustomRequest, CustomResponse } from 'backend/models/expressTypes';
import { getUserReturnData, verifyJWT } from 'backend/utils/util';
import TwilioService from 'backend/services/twilio.service';
import EmailOtpService from 'backend/nodemailer/email-otp.service';
//import express, {Request, Response} from 'express';
//import checkRole from '../../express-middleware/checkRole';
//import isAuth from '../../express-middleware/isAuth';
//import attachCurrentUser from '../../express-middleware/attachCurrentUser';

const app = express();

app.post('/user/login', async (req: CustomRequest, res: CustomResponse) => {
  const email = req.body.user.email;
  const password = req.body.user.password;
  try {
    const authServiceInstance = new AuthService();
    //const { user, token } = await authServiceInstance.Login(email, password);
    const data = await authServiceInstance.Login(email, password);
    //return res.status(200).json({ user, token }).end();
    return res.status(200).send(data);
  } catch (e) {
    //return res.json(e).status(500).end();
    console.log('Error in login: ', e.message);
    return res.status(500).json({ message: e.message });
  }
});

app.post('/user/logout', async (req: CustomRequest, res: CustomResponse) => {
  try {
    const token = getTokenFromHeader(req);
    const authServiceInstance = new AuthService();
    const data = await authServiceInstance.LogOut(token);
    return res.status(200).json({ message: 'logout success !!' });
  } catch (e) {
    console.log('Error in LogOut: ', e.message);
    return res.status(500).json({ message: e.message });
  }
});

// The middlewares need to be placed this way because they depend upong each other
app.post('/user/login-as', attachCurrentUser, checkRole('admin'), async (req: CustomRequest, res: CustomResponse) => {
  try {
    const email = req.body.user.email;
    const authServiceInstance = new AuthService();
    const data = await authServiceInstance.LoginAs(email);
    return res.status(200).send(data);
  } catch (e) {
    console.log('Error in login as user: ', e.message);
    return res.status(500).json({ message: e.message });
  }
});

app.post('/user/login-status-test', attachCurrentUser, async (req: CustomRequest, res: CustomResponse) => {
  try {
    const token = getTokenFromHeader(req);
    const userRecord = req['currentUser'];
    const userReturnData = getUserReturnData(userRecord, token);
    // const userReturnData = {
    //   user: {
    //     email: userRecord.email,
    //     name: userRecord.name,
    //     role: userRecord.role
    //   },
    //   token: token
    // };
    return res.status(200).send(userReturnData);
  } catch (e) {
    console.log('Error in login test: ', e.message);
    return res.status(500).json({ message: e.message });
  }
});

app.post('/user/signup', async (req: CustomRequest, res: CustomResponse) => {
  try {
    const user = req.body.user;
    const authServiceInstance = new AuthService();
    const data = await authServiceInstance.SignUp(user);
    return res.status(200).send(data);
  } catch (e) {
    console.log('Error sign up: ', e.message);
    return res.status(500).json({ message: e.message });
  }
});

app.get('/user/getAll', attachCurrentUser, checkRole('admin'), async (req: CustomRequest, res: CustomResponse) => {
  try {
    const authServiceInstance = new AuthService();
    const data = await authServiceInstance.getAllUsers();
    return res.status(200).send(data);
  } catch (e) {
    console.log('Error getAll User ', e.message);
    return res.status(500).json({ message: e.message });
  }
});

app.post('/user/approve', attachCurrentUser, checkRole('admin'), async (req: CustomRequest, res: CustomResponse) => {
  try {
    const body = req.body;
    const authServiceInstance = new AuthService();
    const data = await authServiceInstance.approveUser(body);
    return res.status(200).send(data);
  } catch (e) {
    console.log(`user approval is failed for ${req.body.email}`, e.message);
    return res.status(500).json({ message: e.message });
  }
});

app.post('/user/unapprove', attachCurrentUser, checkRole('admin'), async (req: CustomRequest, res: CustomResponse) => {
  try {
    const body = req.body;
    const authServiceInstance = new AuthService();
    const data = await authServiceInstance.unApproveUser(body);
    return res.status(200).send(data);
  } catch (e) {
    console.log(`user un-approval is failed for ${req.body.email}`, e.message);
    return res.status(500).json({ message: e.message });
  }
});

app.post('/user/delete', attachCurrentUser, checkRole('admin'), async (req: CustomRequest, res: CustomResponse) => {
  try {
    const body = req.body;
    const authServiceInstance = new AuthService();
    const data = await authServiceInstance.deleteUser(body);
    return res.status(200).send(data);
  } catch (e) {
    console.log(`user Deletion is failed for ${req.body.email}`, e.message);
    return res.status(500).json({ message: e.message });
  }
});

app.post('/user/changePassword', async (req: CustomRequest, res: CustomResponse) => {
  try {
    const body = req.body;
    let data;
    // verify JWT
    const decodedJwt = verifyJWT(body.token, process.env.JWT_TWILIO_SECRET);
    if (!decodedJwt || (decodedJwt.channel === 'sms' && !decodedJwt.phone) || (decodedJwt.channel === 'email' && !decodedJwt.email)) {
      console.log('code verify is failed');
      return res.status(500).json({ message: 'Invalid token' });
    }
    // verify OTP
    if(decodedJwt.channel === 'sms'){
      const twilioService = new TwilioService();
      data = await twilioService.verifyCustomCode(decodedJwt.phone, body.code);
    } else if(decodedJwt.channel === 'email'){
      const emailOtpService = new EmailOtpService();
      data = await emailOtpService.verifyCustomCode(decodedJwt.email, body.code);
    } else{
      return res.status(500).json({ message: 'Invalid Channel' });
    }
    // change password
    const authServiceInstance = new AuthService();
    const passwordChanged = await authServiceInstance.changePassword(decodedJwt, body.password);
    return res.status(200).send(passwordChanged);
  } catch (e) {
    console.log('Error verifying otp ', e.message);
    return res.status(500).json({ message: e.message });
  }
});


export default app;
