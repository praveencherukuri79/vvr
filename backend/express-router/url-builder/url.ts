import { api_config } from './../../config/api_config';

export function getApiRoute(routeName: string, params: {[key: string]: string}): string {
  let url: string;
  switch (routeName) {
    case 'product': {
      url = `${api_config.domain}/${routeName}/${params.commodity}/${api_config.version}/${params.action}`;
      break;
    }
    case 'partner': {
      url = `${api_config.domain}/${routeName}/${api_config.version}/${params.action}`;
      break;
    }
    case 'farmerlotrequest': {
      if (params.reqParam2) {
        url = `${api_config.domain}/${routeName}/${api_config.version}/${params.reqParam1}/${params.reqParam2}`;
      } else {
        url = `${api_config.domain}/${routeName}/${api_config.version}/${params.reqParam1}`;
      }

      break;
    }
    case 'buyerrequest': {
      if (params.reqParam2) {
        url = `${api_config.domain}/${routeName}/${api_config.version}/${params.reqParam1}/${params.reqParam2}`;
      } else {
        url = `${api_config.domain}/${routeName}/${api_config.version}/${params.reqParam1}`;
      }
      break;
    }
    default: {
      //statements;
      break;
    }
  }
  return url;
}
