import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Role, UserResponse } from '../models';
import { UserServiceApi } from '../services/user.service';

@Component({
  selector: 'app-user-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-2">
      <div class="relative">
        <input
          type="search"
          [(ngModel)]="searchTerm"
          (input)="onSearchChange()"
          placeholder="Rechercher un utilisateur..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        />
        <svg
          class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z" />
        </svg>
      </div>

      <select
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        [disabled]="loading || disabled || filteredUsers.length === 0"
        [ngModel]="selectedValue"
        (ngModelChange)="onSelectChange($event)"
      >
        <option value="">{{ placeholder }}</option>
        <option *ngFor="let user of filteredUsers" [value]="user.trackingId">
          {{ user.nom }} {{ user.prenom }} - {{ user.email }}
        </option>
      </select>

      <div *ngIf="loading" class="text-xs text-primary-600">Chargement des utilisateurs...</div>
      <div *ngIf="!loading && filteredUsers.length === 0" class="text-xs text-gray-500">
        Aucun utilisateur disponible pour les critères sélectionnés
      </div>
      <div *ngIf="error" class="text-xs text-red-600">{{ error }}</div>
    </div>
  `
})
export class UserSelectComponent implements OnInit, OnChanges {
  @Input() selectedUserId: string | null = null;
  @Input() allowedRoles: Role[] | null = null;
  @Input() placeholder: string = '-- Sélectionner un utilisateur --';
  @Input() disabled: boolean = false;
  @Output() userSelected = new EventEmitter<string | null>();

  users: UserResponse[] = [];
  filteredUsers: UserResponse[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';
  selectedValue = '';

  constructor(private userService: UserServiceApi) {}

  ngOnInit(): void {
    this.selectedValue = this.selectedUserId ?? '';
    this.loadUsers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedUserId'] && !changes['selectedUserId'].firstChange) {
      this.selectedValue = this.selectedUserId ?? '';
    }

    if (changes['allowedRoles'] && !changes['allowedRoles'].firstChange) {
      this.applyFilters();
    }
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onSelectChange(value: string): void {
    this.selectedValue = value ?? '';
    const emitValue = this.selectedValue || null;
    this.selectedUserId = emitValue;
    this.userSelected.emit(emitValue);
  }

  private loadUsers(): void {
    if (this.loading) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.userService.list().subscribe({
      next: (users) => {
        this.users = Array.isArray(users) ? users : [];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs', err);
        this.error = 'Impossible de charger la liste des utilisateurs';
        this.loading = false;
      }
    });
  }

  private applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredUsers = this.users.filter((user) => {
      const matchesRole = !this.allowedRoles || this.allowedRoles.length === 0 || this.allowedRoles.includes(user.role);
      const matchesSearch = !term ||
        user.nom.toLowerCase().includes(term) ||
        user.prenom?.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term);
      return matchesRole && matchesSearch;
    });

    if (!this.filteredUsers.some((user) => user.trackingId === this.selectedValue)) {
      this.selectedValue = '';
      this.userSelected.emit(null);
    }
  }
}
