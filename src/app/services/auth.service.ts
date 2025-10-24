import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Load user from localStorage on service initialization
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Error loading user from storage', e);
        this.clearStorage();
      }
    }
  }

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/login`, body).pipe(
      tap(response => {
        if (response && response.token) {
          // Store token and user info
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(response));
          this.currentUserSubject.next(response);
        }
      })
    );
  }

  logout(): void {
    // Clear local storage and user state
    this.clearStorage();
    this.currentUserSubject.next(null);
    
    // Optionally call backend logout endpoint
    this.http.post(`${this.base}/logout`, {}, { responseType: 'text' })
      .subscribe({
        next: () => console.log('Logout successful'),
        error: (err) => console.error('Logout error:', err)
      });
    
    // Redirect to login
    this.router.navigate(['/login']);
  }

  private clearStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }

  getUserFullName(): string {
    const user = this.getCurrentUser();
    return user ? `${user.prenom} ${user.nom}` : '';
  }
}
