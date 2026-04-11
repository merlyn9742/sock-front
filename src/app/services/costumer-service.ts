import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models/Costumer';

@Injectable({
  providedIn: 'root',
})
export class CostumerService {
  private readonly API_URL = 'http://localhost:8080/customers';

  constructor(private http: HttpClient) {}

  // Usamos el tenantId para filtrar los clientes del usuario actual
  getAll(tenantId: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.API_URL}/tenant/${tenantId}`);
  }

  create(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.API_URL, customer);
  }

  update(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.API_URL}/${id}`, customer);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
