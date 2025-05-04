import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService {
  private apiUrl =`${environment.apiUrl}/api/timesheets`; // Get API URL from environment

  constructor(private http: HttpClient) {}

  // Get all Timesheets
  getTimesheets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Add a new user
  addTimesheet(timesheet: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, timesheet);
  }

  // Update Timesheet
  updateTimesheetById(id: number, timesheet: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, timesheet);
  }

  getTimesheetByEmpIdYearMonth(assetId: number, year: number, month: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sheet/${assetId}/${year}/${month}`);
  }
  
  // Add a new user
  updateTimesheet(timesheet: any): Observable<any> {
    return this.http.put<any>(this.apiUrl+"/update-timesheet", timesheet);
  }

  // Delete Timesheet
  deleteTimesheet(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
