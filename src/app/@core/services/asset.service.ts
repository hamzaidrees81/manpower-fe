import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private apiUrl = `${environment.apiUrl}/assets`; // Get API URL from environment
  private customApiUrl = `${environment.apiUrl}/asset-projects`; // Get API URL from environment

  // For Payment 
  private apiUrlForPayment = `${environment.apiUrl}/invoice-sponsor-payables`; // Get API URL from environment
  private apiUrlForAssetPayables = `${environment.apiUrl}/asset-payables`; 

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

getAssetByNameAndAssetNumber(name,assetNumber,startDate,endDate): Observable<any[]> {
  return this.http.get<any>(`${this.customApiUrl}/${name}/${assetNumber}`);
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

// For Payment Endpoints
// get asset by status
getSponosrPayableByStatusAndAssetName(status: string, sponsorId: number): Observable<any[]> {
  let params = new HttpParams();

  if (sponsorId !== undefined && sponsorId !== null) {
    params = params.set('sponsorId', sponsorId);
  }

  return this.http.get<any[]>(`${this.apiUrlForPayment}/status/${status}/sponsor`, { params });
}

// Asset Payables

getAssetPayblesByStatusAndAssetName(status: string, assetId: number): Observable<any[]> {
  let params = new HttpParams();

  if (assetId !== undefined && assetId !== null) {
    params = params.set('assetId', assetId);
  }

  return this.http.get<any[]>(`${this.apiUrlForAssetPayables}/status/${status}/asset`, { params });
}

}
