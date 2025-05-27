import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddPurchaseService {
  private apiUrl = `${environment.posApiUrl}/purchase`;

  constructor(private http: HttpClient) {}

  getPurchases(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getPurchaseById(id): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}`);
  }

  addPurchase(purchase: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, purchase);
  }

  updatePurchase(id: number, purchase: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, purchase);
  }

  deletePurchase(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

 getFilteredPurchase(supplierId, shopId, status, startDate, endDate): Observable<any[]> {
  let params = new HttpParams();

  if (supplierId !== undefined && supplierId !== null) {
    params = params.set('supplierId', supplierId.toString());
  }
  if (shopId !== undefined && shopId !== null) {
    params = params.set('shopId', shopId.toString());
  }
  if (status) {
    params = params.set('status', status);
  }
  if (startDate) {
    params = params.set('dateFrom', startDate);
  }
  if (endDate) {
    params = params.set('dateTo', endDate);
}

  return this.http.get<any[]>(`${this.apiUrl}/filter`, { params });
}


}
