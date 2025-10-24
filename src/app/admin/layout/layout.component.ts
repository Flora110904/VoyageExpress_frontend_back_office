import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../models';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  badge?: string;
}

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  isSidebarOpen = true;
  currentUser: LoginResponse | null = null;

  menuItems: MenuItem[] = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: '/admin/dashboard'
    },
    {
      icon: 'users',
      label: 'Utilisateurs',
      route: '/admin/users'
    },
    {
      icon: 'plane',
      label: 'Compagnies',
      route: '/admin/compagnies'
    },
    {
      icon: 'bus',
      label: 'Stations',
      route: '/admin/stations'
    },
    {
      icon: 'building',
      label: 'Établissements',
      route: '/admin/etablissements'
    },
    {
      icon: 'reservations',
      label: 'Réservations',
      route: '/admin/reservations',
      badge: '15'
    },
    {
      icon: 'routes',
      label: 'Trajets',
      route: '/admin/trajets'
    },
    {
      icon: 'vehicles',
      label: 'Véhicules',
      route: '/admin/vehicules'
    }
  ];

  constructor(
    public router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  getUserName(): string {
    return this.authService.getUserFullName() || 'Utilisateur';
  }

  getUserEmail(): string {
    return this.currentUser?.email || '';
  }

  getUserAvatar(): string {
    const name = this.getUserName();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`;
  }

  logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter?')) {
      this.authService.logout();
    }
  }

  getIconSvg(iconName: string): string {
    const icons: { [key: string]: string } = {
      'dashboard': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>',
      'users': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>',
      'plane': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>',
      'bus': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>',
      'building': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>',
      'reservations': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>',
      'routes': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>',
      'vehicles': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>'
    };
    return icons[iconName] || icons['dashboard'];
  }
}
