import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalRequest, LocalResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LocalServiceApi {
  private base = `${environment.apiUrl}/locaux`;
  constructor(private http: HttpClient) {}

  // Backend expects etablissementTrackingId as query param
  create(body: LocalRequest, etablissementTrackingId: string): Observable<LocalResponse> {
    const url = `${this.base}/create?etablissementTrackingId=${encodeURIComponent(etablissementTrackingId)}`;
    return this.http.post<LocalResponse>(url, body);
  }

  get(trackingId: string): Observable<LocalResponse> {
    return this.http.get<LocalResponse>(`${this.base}/${trackingId}`);
  }

  list(): Observable<LocalResponse[]> {
    return this.http.get<LocalResponse[]>(`${this.base}/all`);
  }

  update(trackingId: string, body: LocalRequest): Observable<LocalResponse> {
    return this.http.put<LocalResponse>(`${this.base}/update/${trackingId}`, body);
  }

  delete(trackingId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/delete/${trackingId}`);
  }

  uploadImage(trackingId: string, file: File): Observable<LocalResponse> {
    const form = new FormData();
    form.append('image', file);
    return this.http.post<LocalResponse>(`${this.base}/${trackingId}/image`, form);
  }
}
