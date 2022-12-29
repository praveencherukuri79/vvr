import { google } from 'googleapis';
import { createTransport, Transporter } from 'nodemailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';

// Refer - https://github.com/trulymittal/gmail-api

//oAuth2Client
const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

//get Transport
export const getTransporter = (accessToken): Transporter<SMTPTransport.SentMessageInfo> => {
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

// // sample mail options
// const mailOptionsSample = {
//   from: process.env.EMAIL_AUTH_USER_FROM, // VVR APP <vvr.app.no.reply@gmail.com>
//   to: 'praveencherukuri79@gmail.com',
//   subject: 'Hello from VVR APP',
//   text: 'Welcome to VVR APP',
//   html: '<h1>Welcome to VVR APP</h1>'
// };

//send Email
export async function sendMail(mailOptions) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    return await getTransporter(accessToken).sendMail(mailOptions);
  } catch (e) {
    return e;
  }
}
