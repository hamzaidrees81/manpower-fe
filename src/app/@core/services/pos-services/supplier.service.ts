import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private apiUrl = `${environment.posApiUrl}/suppliers`; // Base URL

  constructor(private http: HttpClient) {}

  // Get all suppliers
  getSuppliers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Add a new supplier
  addSupplier(supplier: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, supplier);
  }

  // Update supplier by ID
  updateSupplier(id: number, supplier: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, supplier);
  }

  // Delete supplier by ID
  deleteSupplier(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Optionally, get a single supplier by ID
  getSupplierById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
