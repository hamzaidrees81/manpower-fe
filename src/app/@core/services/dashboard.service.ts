import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/stats`; // Get API URL from environment

  constructor(private http: HttpClient) {}

  getAssetsStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/assets`);
  }

  getAssetsStatsDetailByAssetId(id): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/assets/${id}`);
  }

  getProjectsStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clients`);
  }

  getProjectsStatsDetailByProjectId(id): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clients/${id}`);
  }
}
