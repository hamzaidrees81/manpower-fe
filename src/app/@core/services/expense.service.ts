import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = `${environment.apiUrl}/api/expenses`; // Get API URL from environment
  private apiUrlForPayment = `${environment.apiUrl}/api/payments`;

  constructor(private http: HttpClient) {}

  // Get all Expenses
  getExpenses(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getLedgers(paymentMethod, paymentDirection, paymentType, selectedPaidToTypes,startDate,endDate): Observable<any[]> {
    const params: any = {};
  
    if (paymentDirection !== null && paymentDirection !== undefined) params.paymentDirection = paymentDirection;
    if (paymentMethod !== null && paymentMethod !== undefined) params.paymentMethod = paymentMethod;
    if (paymentType !== null && paymentType !== undefined) params.paymentType = paymentType;
    if (selectedPaidToTypes !== null && selectedPaidToTypes !== undefined) params.selectedPaidToTypes = selectedPaidToTypes;
    if (startDate !== null && startDate !== undefined) params.startDate = startDate;
    if (endDate !== null && endDate !== undefined) params.endDate = endDate;
  
    return this.http.get<any[]>(`${this.apiUrlForPayment}/ledger/filter`, { params });
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
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

  getExpenseByAssetName(assetId,projectId?,categoryId?): Observable<any[]> {
    let params = new HttpParams();
  
    if (assetId !== undefined && assetId !== null) {
      params = params.set('assetId', assetId);
    }
    if (projectId !== undefined && projectId !== null) {
      params = params.set('projectId', projectId);
    }
    if (categoryId !== undefined && categoryId !== null) {
      params = params.set('categoryId', categoryId);
    }
  
    return this.http.get<any[]>(`${this.apiUrl}/filter`, { params });
  }


  // Payment
    // Add a new Asset
    addPayment(Payment: any): Observable<any> {
      return this.http.post<any>(this.apiUrlForPayment, Payment);
    }


    getPaymentsByFilter(assetId,type): Observable<any[]> {
      let params = new HttpParams();
    
      if (type !== undefined && type !== null) {
        params = params.set('paidToType', type);
      }
      if (assetId !== undefined && assetId !== null) {
        params = params.set('paidToId', assetId);
      }
    
      return this.http.get<any[]>(`${this.apiUrlForPayment}/filter`, { params });
    }
}

