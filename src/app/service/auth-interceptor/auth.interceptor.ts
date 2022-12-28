import { isPlatformBrowser } from '@angular/common';
import { HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import * as utils from '@app/utils/utilities';
const TOKEN_KEY = 'auth-token';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  isBrowser: boolean;
  constructor(@Inject(PLATFORM_ID) platformId: string) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let authReq = req;
    if (this.isBrowser) {
      const token = window.sessionStorage.getItem(TOKEN_KEY);
      if (token != null) {
        authReq = req.clone({
          headers: utils.getHttpHeaders({
            Authorization: this.getAuthorization(),
            'Content-Type': 'application/json'
          })
        });
      }
    }
    return next.handle(authReq);
  }

  getAuthorization(): string {
    const token = window.sessionStorage.getItem(TOKEN_KEY);
    return `Bearer ${token}`;
  }
}
export const authInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }];
