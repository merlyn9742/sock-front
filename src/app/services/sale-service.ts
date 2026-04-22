import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SaleRequest, SaleResponse } from '../models/sales';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private readonly API_URL = `http://localhost:8080/sales`;

  constructor(private http: HttpClient) { }

  processSale(saleRequest: SaleRequest): Observable<SaleResponse> {
    return this.http.post<SaleResponse>(this.API_URL, saleRequest);
  }

  getSales(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'saleDate,desc'); // Ordenar por las más recientes
    return this.http.get<any>(this.API_URL, { params });
  }


  deleteSale(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

}
