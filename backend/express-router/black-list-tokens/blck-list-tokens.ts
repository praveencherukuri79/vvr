const CronJob = require('cron').CronJob;
//const jws = require('jws');
import * as jwt from 'jsonwebtoken';
let blackListTokens = [];

try{
/***  Cron job for removing expired tokens */
console.log('Before job instantiation');

const job = new CronJob('0 */20 * * * *', async function () {
  console.log('cron job triggered, active keys => ', blackListTokens.length);
  let timeStamp = Math.floor(Date.now() / 1000);
  for (let token of blackListTokens) {
    //let decoded = await jws.decode(token, { complete: true });
    let decoded = jwt.decode(token, {complete: true});
    const payload = decoded.payload as jwt.JwtPayload;
    if (!payload || timeStamp >= payload.exp) {
      console.log('removing exp token from blacklist', token);
      blackListTokens.splice(blackListTokens.indexOf(token), 1);
    }
  }
});

console.log('After job instantiation');
job.start();
console.log('After job start');
}catch(e){
  console.log('error in cron job', e);
}


export function getBlackListTokens() {
  return blackListTokens;
}

export function isTokenBlackListed(token): boolean {
  if (blackListTokens.indexOf(token) !== -1) {
    return true;
  }
  return false;
}

export function setBlackListTokens(token) {
  blackListTokens.push(token);
  return true;
}
