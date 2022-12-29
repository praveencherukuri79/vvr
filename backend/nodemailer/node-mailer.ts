//import { oauth2 } from '@googleapis/oauth2';
//import { auth } from 'googleapis-common/build/src/api';
import { OAuth2Client } from 'google-auth-library/build/src';
//import { google } from 'googleapis';
import { createTransport, Transporter } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
//require('dotenv').config();
//import * as dotenv from 'dotenv';
//dotenv.config();
// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

// Refer - https://github.com/trulymittal/gmail-api

//oAuth2Client
//const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
// const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

// console.log('process.env.EMAIL_AUTH_USER before init=> ', process.env.REFRESH_TOKEN);
// oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
// console.log('oAuth2Client refresh_token 1=> ', oAuth2Client.credentials.refresh_token);

//get Transport
// export const getTransporter = (accessToken): Transporter<SMTPTransport.SentMessageInfo> => {
//   return createTransport({
//     service: process.env.EMAIL_SERVICE, // gmail
//     auth: {
//       type: process.env.EMAIL_AUTH_TYPE, // OAuth2
//       user: process.env.EMAIL_AUTH_USER, // vvr.app.no.reply@gmail.com
//       clientId: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       refreshToken: process.env.REFRESH_TOKEN,
//       accessToken: accessToken
//     }
//   } as SMTPTransport.Options);
// };

// // sample mail options
// const mailOptionsSample = {
//   from: process.env.EMAIL_AUTH_USER_FROM, // VVR APP <vvr.app.no.reply@gmail.com>
//   to: 'praveencherukuri79@gmail.com',
//   subject: 'Hello from VVR APP',
//   text: 'Welcome to VVR APP',
//   html: '<h1>Welcome to VVR APP</h1>'
// };

//send Email
// export async function sendMail(mailOptions) {
//   try {
//     console.log('process.env.EMAIL_AUTH_USER after init=> ', process.env.REFRESH_TOKEN);
//     console.log('oAuth2Client refresh_token 2=> ', oAuth2Client.credentials.refresh_token);
//     oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
//     console.log('oAuth2Client refresh_token 3=> ', oAuth2Client.credentials.refresh_token);
//     const accessToken = await oAuth2Client.getAccessToken();
//     return await getTransporter(accessToken).sendMail(mailOptions);
//   } catch (e) {
//     return e;
//   }
// }


export default class NodeMailer {
  oAuth2Client: OAuth2Client;
  mailOptions: Mail.Options;
  constructor(mailOptions) {
    this.oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
    this.oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
    this.mailOptions = mailOptions;
  }
  
  getTransporter = (accessToken): Transporter<SMTPTransport.SentMessageInfo> => {
    return createTransport({
      service: process.env.EMAIL_SERVICE, // gmail
      auth: {
        type: process.env.EMAIL_AUTH_TYPE, // OAuth2
        user: process.env.EMAIL_AUTH_USER, // vvr.app.no.reply@gmail.com
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken
      }
    } as SMTPTransport.Options);
  };

  sendMail = async () => {
    try {
      //oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
      const accessToken = await this.oAuth2Client.getAccessToken();
      //console.log('mailOptions in node mailer => ', this.mailOptions);
      return await this.getTransporter(accessToken).sendMail(this.mailOptions);
    } catch (e) {
      return e;
    }
  }

}