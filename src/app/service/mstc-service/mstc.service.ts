import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MstcService {
  constructor(private http: HttpClient) {}

  getMstc(reportName: string): Observable<any> {
    return this.http.get<any>(`mstc/${reportName}`);
  }

  getMstcReportNames(): Observable<any> {
    return this.http.get<any>('mstcReportNames');
  }

  saveMstc(data): Observable<any> {
    return this.http.post<any>('mstc/save', data);
  }
}
