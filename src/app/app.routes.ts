import { Routes } from '@angular/router';
import { LayoutComponent } from './admin/layout/layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UsersComponent } from './admin/users/users.component';
import { CompagniesComponent } from './admin/compagnies/compagnies.component';
import { StationsComponent } from './admin/stations/stations.component';
import { EtablissementsComponent } from './admin/etablissements/etablissements.component';
import { LoginComponent } from './auth/login.component';
// import { authGuard } from './guards/auth.guard'; // Commenter le guard

export const routes: Routes = [
  { path: '', redirectTo: '/admin/trajets', pathMatch: 'full' }, // Rediriger vers trajets au lieu de login
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: LayoutComponent,
    // canActivate: [authGuard], // Supprimer le guard
    children: [
      { path: '', redirectTo: 'trajets', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'compagnies', component: CompagniesComponent },
      { path: 'stations', component: StationsComponent },
      { path: 'etablissements', component: EtablissementsComponent },
      { path: 'reservations', loadComponent: () => import('./admin/reservations/reservations.component').then(m => m.ReservationsComponent) },
      { path: 'trajets', loadComponent: () => import('./admin/trajets/trajets.component').then(m => m.TrajetsComponent) },
      { path: 'vehicules', loadComponent: () => import('./admin/vehicules/vehicules.component').then(m => m.VehiculesComponent) }
    ]
  },
  // { path: '**', redirectTo: '/login' } // Commenter la redirection par défaut vers login
];
