import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = `${environment.apiUrl}/expenses`; // Get API URL from environment
  private apiUrlForPayment = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  // Get all Expenses
  getExpenses(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Add a new Asset
  addExpense(Expense: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, Expense);
  }

  // Update Expense
  updateExpense(id: number, Expense: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, Expense);
  }

  // Delete Expense
  deleteExpense(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getExpenseByAssetName(assetId: number): Observable<any[]> {
    let params = new HttpParams();
  
    if (assetId !== undefined && assetId !== null) {
      params = params.set('assetId', assetId);
    }
  
    return this.http.get<any[]>(`${this.apiUrl}/filter`, { params });
  }


  // Payment
    // Add a new Asset
    addPayment(Payment: any): Observable<any> {
      return this.http.post<any>(this.apiUrlForPayment, Payment);
    }


    getPaymentsByFilter(assetId: number,type): Observable<any[]> {
      let params = new HttpParams();
    
      if (assetId !== undefined && assetId !== null) {
        params = params.set('paidToType', type);
        params = params.set('paidToId', assetId);
      }
    
      return this.http.get<any[]>(`${this.apiUrlForPayment}/filter`, { params });
    }
}

