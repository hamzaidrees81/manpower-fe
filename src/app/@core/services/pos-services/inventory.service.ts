import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/pos/api/inventory`;

  constructor(private http: HttpClient) {}

  getInventoryItems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addInventoryItem(item: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, item);
  }

  updateInventoryItem(id: number, item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, item);
  }

  deleteInventoryItem(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
