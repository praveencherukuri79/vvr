import { HttpHeaders, HttpParams } from '@angular/common/http';
import { FormGroup, ValidationErrors } from '@angular/forms';

export function isDefined(val: any): boolean {
  if (val !== null && val !== undefined && typeof val !== 'undefined' && val !== '') {
    return true;
  }
  return false;
}
export function getHttpParams(input: { [key: string]: any }): HttpParams {
  let params = new HttpParams();
  // input.forEach(item => {
  //    params = params.append(item.name, item.value);
  // })
  for (const [key, value] of Object.entries(input)) {
    params = params.append(key, value);
  }
  return params;
}
export function getHttpHeaders(input: { [key: string]: any }): HttpHeaders {
  let headers = new HttpHeaders();
  // input.forEach(item => {
  //    headers = headers.set(item.name, item.value);
  // })
  for (const [key, value] of Object.entries(input)) {
    headers = headers.set(key, value);
  }
  return headers;
}
export function buildNameValue(input) {
  let retValue: any = [];
  for (const [key, val] of Object.entries(input)) {
    retValue.push({ name: key, value: val });
  }
  return retValue;
}
export function getParansInput(val): { [key: string]: any } {
  let paramsInput: { [key: string]: any } = {};
  if (val.keyword) {
    paramsInput.keyword = val.keyword;
  }
  if (val.latitude) {
    paramsInput.latitude = val.latitude;
  }
  if (val.longitude) {
    paramsInput.longitude = val.longitude;
  }
  if (val.distance) {
    paramsInput.distance = val.distance;
  }
  if (val.language) {
    paramsInput.language = val.language;
  }
  return paramsInput;
}

/** Forms Utilities */
export function getFieldErrorMessage(form: FormGroup, control: string, messages: { [key: string]: Array<any> }): string {
  const controlErrors: ValidationErrors = form.get(control).errors;
  let errMessages: Array<any> = messages[control];
  let errMsg: string;
  if (controlErrors != null) {
    for (let errorKey of Object.keys(controlErrors)) {
      errMsg = errMessages.find((element) => element.type == errorKey).message;
      break;
    }
  }
  return errMsg;
}

// export function trimUrl(url: string){
//   return url.replace(/^\/|\/$/g, '');
// }

export const trimUrl = (url: string) => {
  return url.replace(/^\/|\/$/g, '');
};