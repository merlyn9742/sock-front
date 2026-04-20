import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Purchase, PurchaseRequest } from '../models/purchase';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private readonly API_URL = `http://localhost:8080/purchase`;

  constructor(private http: HttpClient) {}

getAll(page: number, size: number): Observable<any> {
  return this.http.get<any>(`${this.API_URL}?page=${page}&size=${size}`);
}

  save(request: PurchaseRequest): Observable<Purchase> {
    return this.http.post<Purchase>(this.API_URL, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
