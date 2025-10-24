import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItineraireRequest, ItineraireResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ItineraireServiceApi {
  private base = `${environment.apiUrl}/itineraires`;
  constructor(private http: HttpClient) {}

  create(body: ItineraireRequest): Observable<ItineraireResponse> {
    return this.http.post<ItineraireResponse>(`${this.base}/create`, body);
  }

  get(trackingId: string): Observable<ItineraireResponse> {
    return this.http.get<ItineraireResponse>(`${this.base}/${trackingId}`);
  }

  list(): Observable<ItineraireResponse[]> {
    return this.http.get<ItineraireResponse[]>(`${this.base}/all`);
  }

  update(trackingId: string, body: ItineraireRequest): Observable<ItineraireResponse> {
    return this.http.put<ItineraireResponse>(`${this.base}/update/${trackingId}`, body);
  }

  delete(trackingId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/delete/${trackingId}`);
  }

  // Recherche publique d'itinéraires (sans authentification requise)
  search(depart: string, arrivee: string): Observable<ItineraireResponse[]> {
    const params = new HttpParams()
      .set('depart', depart)
      .set('arrivee', arrivee);
    return this.http.get<ItineraireResponse[]>(`${this.base}/search`, { params });
  }
}
