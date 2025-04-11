import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private apiUrl = `${environment.apiUrl}/accounts`; // Get API URL from environment

  constructor(private http: HttpClient) {}

  // Get all Accounts
  getAccounts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Add a new Asset
  addAccount(Account: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, Account);
  }

  // Update Account
  updateAccount(id: number, Account: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, Account);
  }

  // Delete Account
  deleteAccount(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
