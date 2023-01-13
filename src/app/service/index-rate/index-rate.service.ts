import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndexRateService {
  constructor(private http: HttpClient) {}

  geRate(index: number): Observable<any> {
    return this.http.get<any>(`rate/${index}`);
  }

  geRates(): Observable<any> {
    return this.http.get<any>('rate/all');
  }

  saveRate(data): Observable<any> {
    return this.http.post<any>('rate/save', data);
  }

  saveRatesOverride(data): Observable<any> {
    return this.http.post<any>('rate/save/override', data);
  }
}
