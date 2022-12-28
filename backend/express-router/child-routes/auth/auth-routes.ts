import AuthService from '../../../services/auth.service';
import { checkRole, attachCurrentUser, getTokenFromHeader } from '../../express-middleware/middleware';
import * as express from 'express';
import { CustomRequest, CustomResponse } from 'backend/models/expressTypes';
import { getUserReturnData } from 'backend/utils/util';
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
    const { name, email, password } = req.body.user;
    const authServiceInstance = new AuthService();
    const data = await authServiceInstance.SignUp(email, password, name);
    return res.status(200).send(data);
  } catch (e) {
    console.log('Error sign up: ', e.message);
    return res.status(500).json({ message: e.message });
  }
});

export default app;