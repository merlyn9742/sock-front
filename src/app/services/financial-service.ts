import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FinancialService {

    private readonly API_URL = `http://localhost:8080/financial`;

  constructor(private http: HttpClient) {}

  calculateBundleFinancial(items: any[]): Observable<any> {
  return this.http.post<any>(`${this.API_URL}/calculate/bundle-profit`, items);
}

}
