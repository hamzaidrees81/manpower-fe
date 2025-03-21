import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private apiUrl = `${environment.apiUrl}/assets`; // Get API URL from environment
  private customApiUrl = `${environment.apiUrl}/asset-projects`; // Get API URL from environment

  constructor(private http: HttpClient) {}

  // Get all Assets
  getAssets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAssetsByCompany(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+"/assetsByCompany");
  }

  // Add a new Asset
  addAsset(asset: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, asset);
  }

  // Update Asset
  updateAsset(id: number, asset: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, asset);
  }

  // Delete Asset
  deleteAsset(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Get all Asset Projects
getAssetProjects(): Observable<any[]> {
  return this.http.get<any[]>(this.customApiUrl);
}

// get asset by status
getAssetProjectsByAssetAndActiveStatus(id,status): Observable<any[]> {
  return this.http.get<any>(`${this.customApiUrl}/${id}/${status}`);
}

// Add a new Asset Project
addAssetProject(assetProject: any): Observable<any> {
  return this.http.post<any>(this.customApiUrl,assetProject);
}

// Update an Asset Project
updateAssetProject(id: number, assetProject: any): Observable<any> {
  return this.http.put<any>(`${this.customApiUrl}/${id}`, assetProject);
}

// Delete an Asset Project
deleteAssetProject(id: number): Observable<any> {
  return this.http.delete<any>(`${this.customApiUrl}/${id}`);
}
}
