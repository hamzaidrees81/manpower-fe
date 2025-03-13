
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiUrl = `${environment.apiUrl}/invoices`; // Get API URL from environment

  private invoiceSubject = new BehaviorSubject<any>(null); // Holds the invoice data
  invoice$ = this.invoiceSubject.asObservable(); // Observable to listen for updates

  constructor(private http: HttpClient) {}

  setInvoice(invoice: any) {
    this.invoiceSubject.next(invoice); // Update invoice data
  }

  getInvoice() {
    return this.invoiceSubject.value; // Get current invoice data
  }

  // Get all Invoices
  getInvoices(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Add a new Invoice
  addInvoice(invoice: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, invoice);
  }

   // Add a new Invoice
   prepareInvoic(prepareInvoice: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/prepare-invoice', prepareInvoice);
  }

  // Update Invoice
  updateInvoice(id: number, invoice: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, invoice);
  }

  // Delete Invoice
  deleteInvoice(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

