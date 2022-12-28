// import * as express from 'express';
// import { getApiRoute } from './../url-builder/url';
// import { requestApi } from './../request-promise-handler/request-handle';
// const app = express();
// import { CustomRequest, CustomResponse } from 'backend/models/expressTypes'

// //routes - farmerlotrequest get
// app.get('/farmerlotrequest/:reqParam1/:reqParam2?', async (req: CustomRequest, res: CustomResponse) => {
//   const reqParam1 = req.params.reqParam1;
//   const reqParam2 = req.params.reqParam2;
//   const url = getApiRoute('farmerlotrequest', { reqParam1, reqParam2 });
//   //axiosApiRequestGet(req, res, url);
//   requestApi(req, res, url, 'GET');
// });

// //routes - farmerlotrequest post
// app.post('/farmerlotrequest/:reqParam1/:reqParam2?', async (req: CustomRequest, res: CustomResponse) => {
//   const reqParam1 = req.params.reqParam1;
//   const reqParam2 = req.params.reqParam2;
//   const url = getApiRoute('farmerlotrequest', { reqParam1, reqParam2 });
//   //axiosApiRequestPost(req, res, url);
//   requestApi(req, res, url, 'POST');
// });

// export default app;
