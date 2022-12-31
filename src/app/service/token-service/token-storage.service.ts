import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import * as utils from '@app/utils/utilities';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
// const user =  '0';
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  tokenObsorvable: BehaviorSubject<any> = new BehaviorSubject(null);
  loginStatus: Subject<boolean> = new BehaviorSubject<boolean>(this.isUserLoggedIn());
  isBrowser: boolean;
  constructor(@Inject(PLATFORM_ID) platformId: string, private authService: AuthService) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.verifyLogin();
    }
  }

  verifyLogin() {
    if (this.isUserLoggedIn()) {
      this.authService.logInStatus().subscribe({
        next: (data: any) => {
          this.saveAuth(data);
        },
        error: (error: any) => {
          this.logOut();
          console.log('error in lon in check', error);
        }
    });
    }
  }

  signOut(): Observable<any> {
    console.log('sessionStorage cleared on signOut');
    window.sessionStorage.clear();
    this.loginStatus.next(false);
    return this.tokenObsorvable.asObservable();
  }

  logOut() {
    console.log('sessionStorage cleared on logOut');
    window.sessionStorage.clear();
    this.loginStatus.next(false);
    this.tokenObsorvable.next(this.getToken());
  }
  // saveToken(token: string) {
  //   window.sessionStorage.removeItem(TOKEN_KEY);
  //   window.sessionStorage.setItem(TOKEN_KEY, token);
  //   this.tokenObsorvable.next(this.getToken());
  // }

  saveAuth(data: any) {
    console.log('sessionStorage cleared and reset');
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, data.token);
    this.saveUser(data.user);
    this.tokenObsorvable.next(this.getToken());
    this.loginStatus.next(true);
  }

  getToken(): string {
    if (this.isBrowser) {
      return window.sessionStorage.getItem(TOKEN_KEY);
    }
    return '';
  }

  saveUser(user) {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser() {
    if (this.isBrowser) {
      return JSON.parse(window.sessionStorage.getItem(USER_KEY));
    }
    return '';
  }

  isUserLoggedIn(): boolean {
    return utils.isDefined(this.getToken());
  }

  getLatestToken(): Observable<any> {
    return this.tokenObsorvable.asObservable();
  }

  getAuthorization(): string {
    let token = this.getToken();
    return `Bearer ${token}`;
  }
}
