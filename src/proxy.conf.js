const host = 'localhost';
const port_server = '8000';
const port_browser = '4200';
const target_server = `http://${host}:${port_server}`;
const target_browser = `http://${host}:${port_browser}`;
const staticRoute = 'static';

const PROXY_CONFIG = [
  {
    context: ['/buyerrequest', '/farmerlotrequest', '/partner', '/product', '/create-payment-intent', '/print-db', '/user','/mstc'],
    target: target_server,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug'
  },
  {
    context: [staticRoute],
    target: target_browser,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: function (url) {
      return url.replace(staticRoute, '');
    }
  }
];

module.exports = PROXY_CONFIG;
