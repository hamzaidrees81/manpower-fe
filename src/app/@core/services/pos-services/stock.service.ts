import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private apiUrl = `${environment.posApiUrl}/stocks`;

  constructor(private http: HttpClient) {}

  getStocks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getStocksByStatus(status,shopId): Observable<any[]> {
     let params = new HttpParams();

  if (status !== undefined && status !== null) {
    params = params.set('stocksForPage', status);
  }
    if (shopId !== undefined && shopId !== null) {
    params = params.set('shopId', shopId);
  }
    return this.http.get<any[]>(this.apiUrl,{ params });
  }

  addStock(stock: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, stock);
  }

  updateStock(id: number, stock: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, stock);
  }

  deleteStock(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
