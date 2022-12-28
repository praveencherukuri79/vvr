// import * as express from 'express';
// import { getApiRoute } from './../url-builder/url';
// import { requestApi } from './../request-promise-handler/request-handle';
// const app = express();
// import { CustomRequest, CustomResponse } from 'backend/models/expressTypes'

// //routes - partner get
// app.get('/partner/:action', async (req: CustomRequest, res: CustomResponse) => {
//   const action = req.params.action;
//   const url = getApiRoute('partner', { action });
//   //axiosApiRequestGet(req, res, url);
//   requestApi(req, res, url, 'GET');
// });

// //routes - partner post
// app.post('/partner/:action', async (req: CustomRequest, res: CustomResponse) => {
//   const action = req.params.action;
//   const url = getApiRoute('partner', { action });
//   //axiosApiRequestPost(req, res, url);
//   requestApi(req, res, url, 'POST');
// });

// export default app;
