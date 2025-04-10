import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Company {
  id?: number;
  name: string;
  address: string;
  maxAssetCount: number;
}

export interface Account {
  id?: number;
  name: string;
  type: string; // You can extend this if there are other types
  description: string;
  balance: number;
  accountNumber: number;
  iban: string;
  bankName: string;
  isDefaultAccount: 'YES' | 'NO';
  status: string; // Add more statuses if needed
}


@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private apiUrl = `${environment.apiUrl}/companies`;
  private apiUrlForAccounts = `${environment.apiUrl}/accounts`;

  constructor(private http: HttpClient) { }

  // Fetch all companies
  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl);
  }

  // Add new company
  addCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, company);
  }

  // Update existing company
  updateCompany(company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/${company.id}`, company);
  }

  // Delete company
  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // For Accounts

  // Fetch all companies
  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrlForAccounts);
  }

  // Add new Account
  addAccount(Account: Account): Observable<Account> {
    return this.http.post<Account>(this.apiUrlForAccounts, Account);
  }

  // Update existing Account
  updateAccount(Account: Account): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrlForAccounts}/${Account.id}`, Account);
  }

  // Delete Account
  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlForAccounts}/${id}`);
  }
}
