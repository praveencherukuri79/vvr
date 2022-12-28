import 'zone.js/dist/zone-node';
import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import 'zone.js/dist/zone-node';
//const compression = require('compression');
import { AppServerModule } from './../../src/main.server';
import { CustomRequest, CustomResponse } from 'backend/models/expressTypes';
//import * as  Window from 'window';
//const Window = require('window');
//const window = new Window();
//const { document } = new Window();
//child routes
// import buyerRequest from './child-routes/buyerRequest-routes';
// import formerlotRequest from './child-routes/formerlotRequest-routes';
// import partner from './child-routes/partner-routes';
// import product from './child-routes/product-routes';
import authRoutes from './child-routes/auth/auth-routes';
//import stripePayment from './child-routes/stripe-payments';

//import {mongoConnect} from './mongoDB';
//import {mongoConnect2} from './mongoDB';

//const domino = require('domino');
//const fs = require('fs');
//const path = require('path');
//const indexPath = join(process.cwd(), 'dist/coreWebapp/browser/index.html');
//const template = readFileSync(indexPath).toString();
//const win = domino.createWindow(template);
//global['window'] = win;
//global['document'] = win.document;
//global['navigator'] = win.navigator;

//const buyerRequest = require('./child-routes/buyerRequest-routes');
//const formerlotRequest = require('./child-routes/formerlotRequest-routes');
//const partner = require('./child-routes/partner-routes');
//const product = require('./child-routes/product-routes');

const bodyParser = require('body-parser');
//const jsonParser = bodyParser.json();
//const urlencodedParser = bodyParser.urlencoded({ extended: false });

// The Express app is exported so that it can be used by serverless Functions.
export function express_app(): express.Express {
  const app = express();
  const distFolder = join(process.cwd(), 'dist/vvr/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  app.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );
  app.set('view engine', 'html');
  app.set('views', distFolder);
  app.use(
    '/static',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );
  // compress all responses
  //app.use(compression());
  // parse application/json
  app.use(bodyParser.json());
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  //child routes (imported express routes)
  // app.use(buyerRequest);
  // app.use(formerlotRequest);
  // app.use(partner);
  // app.use(product);
  app.use(authRoutes);
  //app.use(stripePayment);

  // app.get('/print-db', async (req: CustomRequest, res: CustomResponse) => {
  //   let list = await mongoConnect2();
  //   res.send(list);
  // });

  // Example Express Rest API endpoints
  // server.get('/api/**', (req: CustomRequest, res: CustomResponse) => { });
  // Serve static files from /browser
  app.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Universal engine
  app.get('*', (req: CustomRequest, res: CustomResponse) => {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });
  });

  return app;
}
