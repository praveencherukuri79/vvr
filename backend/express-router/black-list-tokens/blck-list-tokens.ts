const CronJob = require('cron').CronJob;
const jws = require('jws');

/***  Cron job for removing expired tokens */
let blackListTokens = [];
console.log('Before job instantiation');

const job = new CronJob('0 */20 * * * *', async function () {
  let timeStamp = Math.floor(Date.now() / 1000);
  for (let token of blackListTokens) {
    let decoded = await jws.decode(token, { complete: true });
    if (timeStamp >= decoded.payload.exp) {
      console.log('removing exp token from blacklist', token);
      blackListTokens.splice(blackListTokens.indexOf(token), 1);
    }
  }
});

console.log('After job instantiation');
job.start();

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
