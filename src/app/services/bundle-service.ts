import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface BundleDTO {
  id?: number;
  name: string;
  fixedPrice: number;
  items: BundleItemDTO[];
}

export interface BundleItemDTO {
  id?: number;
  productId?: number;
  product?: {id: number}
  productName?: string; 
  quantity: number;
  assignedUnitPrice: number;
}

@Injectable({
  providedIn: 'root',
})
export class BundleService {
  private apiUrl = `http://localhost:8080/bundles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<BundleDTO[]> {
    return this.http.get<BundleDTO[]>(this.apiUrl);
  }

  getById(id: number): Observable<BundleDTO> {
    return this.http.get<BundleDTO>(`${this.apiUrl}/${id}`);
  }

  save(bundle: BundleDTO): Observable<BundleDTO> {
    if (bundle.id) {
      return this.http.put<BundleDTO>(`${this.apiUrl}/${bundle.id}`, bundle);
    }
    return this.http.post<BundleDTO>(this.apiUrl, bundle);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
