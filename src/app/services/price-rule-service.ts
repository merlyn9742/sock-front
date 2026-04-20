import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PriceRule } from '../models/PriceRule';


@Injectable({ providedIn: 'root' })
export class PriceRuleService {
  private apiUrl = 'http://localhost:8080/price-rule';

  constructor(private http: HttpClient) {}

  getAllPriceRules(): Observable<Map<number, Array<PriceRule>>> {
    return this.http.get<Map<number, Array<PriceRule>>>(this.apiUrl);
  }

  // Obtener todas las reglas de un producto específico
  getByProduct(productId: number): Observable<PriceRule[]> {
    return this.http.get<PriceRule[]>(`${this.apiUrl}/product/${productId}`);
  }

  create(rule: PriceRule): Observable<PriceRule> {
    return this.http.post<PriceRule>(this.apiUrl, rule);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}