import * as express from 'express';
import { getApiRoute } from './../url-builder/url';
import { requestApi } from './../request-promise-handler/request-handle';
const app = express();
import { CustomRequest, CustomResponse } from 'backend/models/expressTypes'

//routes - product get
app.get('/product/:commodity/:action', (req: CustomRequest, res: CustomResponse) => {
  const commodity = req.params.commodity;
  const action = req.params.action;
  const url = getApiRoute('product', { commodity, action });
  //axiosApiRequestGet(req, res, url);
  requestApi(req, res, url, 'GET');
});

//routes - product post
app.post('/product/:commodity/:action', async (req: CustomRequest, res: CustomResponse) => {
  const commodity = req.params.commodity;
  const action = req.params.action;
  const url = getApiRoute('product', { commodity, action });
  //axiosApiRequestPost(req, res, url);
  requestApi(req, res, url, 'POST');
});

export default app;
