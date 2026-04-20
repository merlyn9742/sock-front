import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SaleRequest, SaleResponse } from '../models/sales';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private readonly API_URL = `http://localhost:8080/sales`;

  constructor(private http: HttpClient) { }

  /**
   * Procesa una venta que puede contener productos individuales y/o bundles.
   * @param saleRequest Objeto con customerId, productos y bundles.
   */
  processSale(saleRequest: SaleRequest): Observable<SaleResponse> {
    return this.http.post<SaleResponse>(this.API_URL, saleRequest);
  }

  /**
   * Opcional: Obtener historial de ventas
   */
  getSalesHistory(): Observable<SaleResponse[]> {
    return this.http.get<SaleResponse[]>(this.API_URL);
  }

  /**
   * Opcional: Obtener detalle de una venta específica
   */
  getSaleById(id: number): Observable<SaleResponse> {
    return this.http.get<SaleResponse>(`${this.API_URL}/${id}`);
  }
}
