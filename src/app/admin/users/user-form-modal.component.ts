import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserRequest, UserResponse } from '../../models/user.model';
import { Role } from '../../models/enums.model';
import { UserServiceApi } from '../../services/user.service';

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 overflow-y-auto" (click)="closeOnBackdrop($event)">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <!-- Modal -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">
              Formulaire utilisateur
            </h2>
            <button (click)="close()" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>

          <!-- Form -->
          <form (ngSubmit)="onSubmit()" #userForm="ngForm">
            <div class="space-y-4">
              <!-- Nom & Prénom -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                  <input 
                    type="text" 
                    [(ngModel)]="formData.nom" 
                    name="nom"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Diallo">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                  <input 
                    type="text" 
                    [(ngModel)]="formData.prenom" 
                    name="prenom"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Amadou">
                </div>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input 
                  type="email" 
                  [(ngModel)]="formData.email" 
                  name="email"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="amadou.diallo@email.com">
              </div>

              <!-- Téléphone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                <input 
                  type="tel" 
                  [(ngModel)]="formData.telephone" 
                  name="telephone"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+221 77 123 45 67">
              </div>

              <!-- Rôle -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Rôle *</label>
                <select 
                  [(ngModel)]="formData.role" 
                  name="role"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="">-- Sélectionner un rôle --</option>
                  <option [value]="Role.ADMIN">Administrateur</option>
                  <option [value]="Role.CLIENT">Client</option>
                  <option [value]="Role.COMPAGNIE_AERIEN">Compagnie Aérienne</option>
                  <option [value]="Role.COMPAGNIE_BUS">Compagnie Bus</option>
                  <option [value]="Role.ETABLISSEMENT">Établissement</option>
                </select>
              </div>

              <!-- Password (only for new users) -->
              <div *ngIf="!isEditMode">
                <label class="block text-sm font-medium text-gray-700 mb-2">Mot de passe *</label>
                <input 
                  type="password" 
                  [(ngModel)]="formData.password" 
                  name="password"
                  [required]="!isEditMode"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••">
              </div>
            </div>

            <!-- Loading/Error -->
            <div *ngIf="loading" class="mt-4 text-center text-primary-600">
              Enregistrement en cours...
            </div>
            <div *ngIf="error" class="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {{ error }}
            </div>

            <!-- Actions -->
            <div class="flex gap-3 mt-6 pt-6 border-t">
              <button 
                type="button"
                (click)="close()" 
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                Annuler
              </button>
              <button 
                type="submit"
                [disabled]="!userForm.form.valid || loading"
                class="flex-1 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isEditMode ? 'Modifier' : 'Ajouter' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class UserFormModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() user: UserResponse | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<UserResponse>();

  Role = Role;
  isEditMode = false;
  loading = false;
  error: string | null = null;

  formData: UserRequest = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: Role.CLIENT,
    telephone: ''
  };

  constructor(private userService: UserServiceApi) {}

  ngOnInit() {
    this.applyUserToForm(this.user);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      this.applyUserToForm(changes['user'].currentValue as UserResponse | null);
    }
  }

  onSubmit() {
    this.loading = true;
    this.error = null;

    if (this.isEditMode && this.user) {
      // Update
      this.userService.update(this.user.trackingId, this.formData).subscribe({
        next: (response) => {
          this.loading = false;
          this.saved.emit(response);
          this.close();
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Erreur lors de la modification de l\'utilisateur';
          console.error(err);
        }
      });
    } else {
      // Create
      this.userService.inscription(this.formData).subscribe({
        next: (response) => {
          this.loading = false;
          this.saved.emit(response);
          this.close();
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Erreur lors de l\'ajout de l\'utilisateur';
          console.error(err);
        }
      });
    }
  }

  private applyUserToForm(user: UserResponse | null) {
    if (user) {
      this.isEditMode = true;
      this.formData = {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        password: '',
        role: user.role,
        telephone: user.telephone
      };
    } else {
      this.isEditMode = false;
      this.formData = {
        nom: '',
        prenom: '',
        email: '',
        password: '',
        role: Role.CLIENT,
        telephone: ''
      };
    }
  }

  close() {
    this.isOpen = false;
    this.closed.emit();
  }

  closeOnBackdrop(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.close();
    }
  }
}
