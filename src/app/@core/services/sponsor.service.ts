
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SponsorService {
  private apiUrl = `${environment.apiUrl}/sponsors`; // Get API URL from environment

  constructor(private http: HttpClient) {}

  // Get all Sponsorss
  getSponsors(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Add a new Sponsors
  addSponsors(Sponsors: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, Sponsors);
  }

  // Update Sponsors
  updateSponsors(id: number, Sponsors: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, Sponsors);
  }

  // Delete Sponsors
  deleteSponsors(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

