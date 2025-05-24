import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private apiUrl = `${environment.posApiUrl}/shops`;

  constructor(private http: HttpClient) {}

  getShops(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addShop(shop: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, shop);
  }

  updateShop(id: number, shop: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, shop);
  }

  deleteShop(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
