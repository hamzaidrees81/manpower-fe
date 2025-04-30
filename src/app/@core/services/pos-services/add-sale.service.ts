import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddSaleService {
  private apiUrl = `${environment.posApiUrl}/sales`;

  constructor(private http: HttpClient) {}

  getSales(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addSale(sale: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, sale);
  }

  updateSale(id: number, sale: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, sale);
  }

  deleteSale(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
