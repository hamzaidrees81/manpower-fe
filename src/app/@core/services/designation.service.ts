import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DesignationService {
  private apiUrl = `${environment.apiUrl}/api/designations`; // Get API URL from environment

  constructor(private http: HttpClient) {}

  // Get all Designations
  getDesignations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Add a new Asset
  addDesignation(designation: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, designation);
  }

  // Update Designation
  updateDesignation(id: number, designation: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, designation);
  }

  // Delete Designation
  deleteDesignation(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
