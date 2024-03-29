import 'zone.js/dist/zone-node';
import { express_app } from './express-router/routes';
import * as mongoose from 'mongoose';
//import { sendMail } from './nodemailer/node-mailer';
//if (process.env.NODE_ENV !== 'production') {
//import * as dotenv from 'dotenv';
//dotenv.config();
//require('dotenv').config();
//}

//import * as  Window from 'window';
//const Window = require('window');

//const window = new Window();
//const { document } = new Window();

//const jsdom    = require("./lib/jsdom").jsdom;
//  const document = jsdom("<html><head></head><body>hello world</body></html>");
//    const window   = document.createWindow();

//const { window } = new JSDOM('<!doctype html><html><body></body></html>');
//global.document = window.document;
//global.window = global.document.defaultView;

// const domino = require('domino');
// const fs = require('fs');
// const path = require('path');
// const template = fs.readFileSync(path.join(__dirname, '.', 'dist', 'index.html')).toString();
// const win = domino.createWindow(template);
// global['window'] = win;
// global['document'] = win.document;

function run(): void {
  const port = process.env.PORT || 8000;

  console.log('process.env.DATABASE_USER => ', process.env.DATABASE_USER);
  console.log('process.env.EMAIL_AUTH_USER_FROM => ', process.env.EMAIL_AUTH_USER_FROM);
  console.log('process.env.REFRESH_TOKEN => ', process.env.REFRESH_TOKEN);
  console.log('process.env.EMAIL_AUTH_USER => ', process.env.EMAIL_AUTH_USER);
  // Start up the Node server
  const server = express_app();
  server.listen(port, async () => {
    let DB_URI = process.env.DATABASE_URI.replace('{{user}}', process.env.DATABASE_USER);
    DB_URI = DB_URI.replace('{{password}}', process.env.DATABASE_PASSWORD);
    DB_URI = DB_URI.replace('{{dbname}}', process.env.DATABASE_TABLE);
    const MongoLocal = process.env.MONGO_HOST || 'mongodb://localhost/core-webapp';
    //const mongoConnection = await mongoose.connect(DB_URI);
    //console.log('DB_URI => ',DB_URI);
    //const mongoConnection = await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    //console.log('connecting to MongoLocal Database => ', MongoLocal);
    //const mongoConnection = await mongoose.connect(MongoLocal, { useNewUrlParser: true, useUnifiedTopology: true });
    // const mongoConnection = await mongoose.connect(MongoLocal);
    mongoose.set('strictQuery', false);
    const mongoConnection = await mongoose.connect(DB_URI);

    console.log('Mongo Database ready!');
    console.log(`NODE SERVER LISTENING ON PORT - ${port}`);

    // console.log('sending email!');
    // sendMail()
    //   .then((result) => console.log('Email sent...', result))
    //   .catch((error) => console.log(error.message));
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  console.log('calling RUN !');
  run();
}

export * from './../src/main.server';
