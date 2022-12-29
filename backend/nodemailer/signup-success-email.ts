import { sendMail } from './node-mailer';

const mailOptions = {
  from: process.env.EMAIL_AUTH_USER_FROM, // VVR APP <vvr.app.no.reply@gmail.com>
  subject: 'Thanks for signing up!',
  to: '{{email}}',
  text: 'Welcome to VVR APP, Hello {{name}}, you signed up as {{email}}, You can login at {{url}}/login',
  html: `<div>
          <h3>Hello {{name}},</h3>
          <br>
          <p>Welcome to VVR App</p>
          <br>
          <p>You signed up as <a href="mailto:{{email}}" target="_blank">{{email}}</a></p>
          <p>You can login at <a href="{{url}}/login" target="_blank">VVR App</a></p>
</div>`
};

const replaceStrings = [
  { name: '{{name}}', type: 'name' },
  { name: '{{email}}', type: 'email' },
  { name: '{{url}}', type: 'url' }
];

const getMailOptions = (userRecord) => {
  replaceStrings.forEach((item) => {
    switch (item.type) {
      case 'name':
        mailOptions.text = mailOptions.text.replaceAll(item.name, userRecord.name);
        mailOptions.html = mailOptions.html.replaceAll(item.name, userRecord.name);
        break;
      case 'email':
        mailOptions.text = mailOptions.text.replaceAll(item.name, userRecord.email);
        mailOptions.html = mailOptions.html.replaceAll(item.name, userRecord.email);
        mailOptions.to = mailOptions.to.replaceAll(item.name, userRecord.email);
        break;
      case 'url':
        mailOptions.text = mailOptions.text.replaceAll(item.name, process.env.VVR_APP_URL);
        mailOptions.html = mailOptions.html.replaceAll(item.name, process.env.VVR_APP_URL);
        break;
    }
  });

  return mailOptions;
};

export const sendSignupEmail = (userRecord) => {
  const signUpMailOptions = getMailOptions(userRecord);
  console.log('signUpMailOptions => ', signUpMailOptions)
  sendMail(signUpMailOptions)
    .then((result) => console.log('Email sent...', result))
    .catch((error) => console.log(error.message));
};
