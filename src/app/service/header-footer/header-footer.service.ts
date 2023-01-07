import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderFooterService {
  constructor(private http: HttpClient) {}

  getHeaderFooterData(): Observable<any> {
    return this.http.get<any>('header-footer');
  }

  saveHeaderFooterData(data): Observable<any> {
    return this.http.post<any>('header-footer/save', data);
  }
}
