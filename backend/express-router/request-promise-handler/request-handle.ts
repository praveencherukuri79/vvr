//import * as bodyParser from 'body-parser';
//import * as request from 'request';
//const request = require('request');
//import axios from 'axios';
//const axios = require('axios').default;
//var rp = require('request-promise');
import * as request from 'request-promise';
//import * as express from 'express';
import { CustomRequest, CustomResponse } from 'backend/models/expressTypes'

// export function getAxiosOptions(req: CustomRequest) {
//   let options = {};
//   if (req.query && Object.keys(req.query).length > 0) {
//     options['params'] = req.query;
//   }
//   //if (req.headers && Object.keys(req.headers).length > 0) {
//   options['headers'] = req.headers;
//   //}
//   options['data'] = {};
//   options['headers'].accept = 'application/json';
//   return options;
// }

// export function axiosApiRequestGet(req, res, url) {
//   const options = getAxiosOptions(req: CustomRequest);
//   axios
//     .get(url)
//     .then((response) => {
//       // api call success
//       res.send(response);
//     })
//     .catch((error) => {
//       res.send(error);
//       // handle error (need to implement)
//     })
//     .then(() => {
//       // complete of axios -- always executed (default for all for any specific data processing)
//     });
// }

// export function axiosApiRequestPost(req, res, url) {
//   const options = getAxiosOptions(req: CustomRequest);
//   axios
//     .post(url, req.body, options)
//     .then((response) => {
//       // api call success
//       res.send(response);
//     })
//     .catch(function (error) {
//       // handle error (need to implement)
//     })
//     .then(function () {
//       // complete of axios -- always executed (default for all for any specific data processing)
//     });
// }

export function buildRequestOptions(req: CustomRequest, url: string, method: string) {
  let options: any = {
    method: method,
    uri: url,
    qs: req.query,
    body: req.body,
    headers: {},
    json: true // Automatically stringifies the body to JSON
    // transform: (body, response) => {
    //   if (response.headers['content-type'] === 'application/json') {
    //     response.body = JSON.parse(body);
    //   }
    //   return body;
    // }
  };
  if (req.headers && req.headers.authorization) {
    options.headers.authorization = req.headers.authorization;
  }
  return options;
}

export function requestApi(req: CustomRequest, res: CustomResponse, url: string, method: string) {
  const options = buildRequestOptions(req, url, method);
  request(options)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: 'some thing went wrong' });
      //res.send(err);
    });
}
