import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientService {


  private apiUrl = `${environment.apiUrl}/clients`; // Get API URL from environment

  constructor(private http: HttpClient) {}

  // Get all clients
  getClients(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Add a new client
  addClient(client: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, client);
  }

  // Update client
  updateClient(id: number, client: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, client);
  }

  // Delete client
  deleteClient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
