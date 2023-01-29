import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  logIn(data): Observable<any> {
    return this.http.post<any>('user/login', data);
  }

  logOut(): Observable<any> {
    return this.http.post<any>('user/logout', {});
  }

  signUp(data): Observable<any> {
    return this.http.post<any>('user/signup', data);
  }

  logInStatus(): Observable<any> {
    return this.http.post<any>('user/login-status-test', null);
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>('user/getAll');
  }

  approveUser(data): Observable<any> {
    return this.http.post<any>('user/approve', data);
  }

  unApproveUser(data): Observable<any> {
    return this.http.post<any>('user/unapprove', data);
  }

  deleteUser(data): Observable<any> {
    return this.http.post<any>('user/delete', data);
  }

  changePassword(data): Observable<any> {
    return this.http.post<any>('user/changePassword', data);
  }
}
