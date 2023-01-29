import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TwilioService {
  constructor(private http: HttpClient) {}

  sendMessage(data): Observable<any> {
    return this.http.post<any>('twilio/sendMessage', data);
  }

  sendOtp(data): Observable<any> {
    return this.http.post<any>('twilio/sendOtp', data);
  }

  verifyOtp(data): Observable<any> {
    return this.http.post<any>('twilio/verifyOtp', data);
  }
}
