import NodeMailer from './node-mailer';

const getMailOptions = (user) => {
  const url = process.env.VVR_APP_URL;
  return {
    from: process.env.EMAIL_AUTH_USER_FROM,
    subject: 'Thanks for signing up!',
    to: `${user.email}`,
    text: `Welcome to VVR APP, Hello ${user.name}, you signed up as ${user.email}, You can login at ${url}/login`,
    html: `<div>
            <h3>Hello ${user.name},</h3>
            <br>
            <p>Welcome to VVR App</p>
            <br>
            <p>You signed up as <a href="mailto:${user.name}" target="_blank">${user.email}</a></p>
            <p>You can login at <a href="${url}/login" target="_blank">VVR App</a></p>
  </div>`
  };
};

export const sendSignupEmail = (user) => {
  const signUpMailOptions = getMailOptions(user);
  const nodeMailerInstance = new NodeMailer(signUpMailOptions);
  nodeMailerInstance
    .sendMail()
    .then((result) => console.log('Email sent...', result))
    .catch((error) => console.log(error.message));
};
