import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getSalesById(id): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}`);
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

 getFilteredSales(clientId, shopId, status, startDate, endDate): Observable<any[]> {
  let params = new HttpParams();

  if (clientId !== undefined && clientId !== null) {
    params = params.set('clientId', clientId.toString());
  }
  if (shopId !== undefined && shopId !== null) {
    params = params.set('shopId', shopId.toString());
  }
  if (status) {
    params = params.set('status', status);
  }
  if (startDate) {
    params = params.set('startDate', startDate);
  }
  if (endDate) {
    params = params.set('endDate', endDate);
}

  return this.http.get<any[]>(`${this.apiUrl}/filter`, { params });
}


}
