import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from '../models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center p-4 relative overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0">
        <div class="absolute top-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-400/5 rounded-full blur-2xl"></div>
      </div>

      <div class="max-w-md w-full relative z-10">
        <!-- Logo & Title -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-white to-accent-100 bg-clip-text text-transparent mb-2">VoyageExpress</h1>
          <p class="text-primary-100 text-lg">Administration Backoffice</p>
        </div>

        <!-- Login Card -->
        <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Connexion</h2>
            <p class="text-gray-600 text-sm">Accédez à votre espace d'administration</p>
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
            <div class="flex items-center gap-3">
              <div class="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                <span class="text-red-600 text-sm">!</span>
              </div>
              <div>
                <p class="text-red-800 font-medium text-sm">Erreur de connexion</p>
                <p class="text-red-600 text-xs mt-0.5">{{ errorMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Login Form -->
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <div class="space-y-5">
              <!-- Email -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  <span class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                    </svg>
                    Adresse email
                  </span>
                </label>
                <div class="relative">
                  <input
                    type="email"
                    name="email"
                    [(ngModel)]="credentials.email"
                    required
                    email
                    placeholder="votre@email.com"
                    class="w-full pl-4 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 bg-gray-50/50"
                    [class.border-red-300]="loginForm.submitted && !credentials.email"
                    [class.focus:ring-red-500]="loginForm.submitted && !credentials.email">
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Password -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  <span class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    Mot de passe
                  </span>
                </label>
                <div class="relative">
                  <input
                    type="password"
                    name="password"
                    [(ngModel)]="credentials.password"
                    required
                    minlength="6"
                    placeholder="••••••••"
                    class="w-full pl-4 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 bg-gray-50/50"
                    [class.border-red-300]="loginForm.submitted && !credentials.password"
                    [class.focus:ring-red-500]="loginForm.submitted && !credentials.password">
                  <button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Remember Me & Forgot Password -->
              <div class="flex items-center justify-between">
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" class="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300">
                  <span class="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">Se souvenir de moi</span>
                </label>
                <a href="#" class="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
                  Mot de passe oublié?
                </a>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                [disabled]="loading"
                class="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-4 px-6 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <span *ngIf="loading" class="animate-spin">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                </span>
                <span>{{ loading ? 'Connexion en cours...' : 'Se connecter' }}</span>
              </button>
            </div>
          </form>

          <!-- Footer -->
          <div class="mt-6 pt-6 border-t border-gray-100 text-center">
            <p class="text-xs text-gray-500">
              Besoin d'aide ? Contactez le support technique
            </p>
          </div>
        </div>

        <!-- Footer Info -->
        <div class="text-center mt-6">
          <p class="text-primary-100 text-sm">
            © 2024 VoyageExpress. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class LoginComponent {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };

  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.loading = false;
        // Redirect to dashboard
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error) => {
        console.error('Login error', error);
        this.loading = false;

        if (error.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect';
        } else if (error.status === 0) {
          this.errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.';
        } else {
          this.errorMessage = error.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
        }
      }
    });
  }
}
