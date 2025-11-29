import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompagnieRequest, CompagnieResponse } from '../../models/compagnie.model';
import { Role, TypeCompagnie } from '../../models/enums.model';
import { CompagnieServiceApi } from '../../services/compagnie.service';
import { UserSelectComponent } from '../../shared/user-select.component';

@Component({
  selector: 'app-compagnie-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, UserSelectComponent],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 overflow-y-auto" (click)="closeOnBackdrop($event)">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">
              {{ isEditMode ? 'Modifier la compagnie' : 'Nouvelle compagnie' }}
            </h2>
            <button (click)="close()" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>

          <form (ngSubmit)="onSubmit()" #compagnieForm="ngForm">
            <div class="space-y-4">
              <!-- Nom -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom de la compagnie *</label>
                <input 
                  type="text" 
                  [(ngModel)]="formData.nom" 
                  name="nom"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Air Sénégal">
              </div>

              <!-- Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                <select 
                  [(ngModel)]="formData.type" 
                  name="type"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="">-- Sélectionner un type --</option>
                  <option [value]="TypeCompagnie.AEROPORT">Compagnie Aérienne</option>
                  <option [value]="TypeCompagnie.STATION">Station de Bus</option>
                </select>
              </div>

              <!-- Téléphone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                <input
                  type="tel"
                  [(ngModel)]="formData.telephone"
                  name="telephone"
                  required
                  maxlength="20"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+221 77 123 45 67">
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  [(ngModel)]="formData.email"
                  name="email"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="contact@compagnie.sn">
              </div>

              <!-- Adresse -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <input
                  type="text"
                  [(ngModel)]="formData.adresse"
                  name="adresse"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Dakar, Sénégal">
              </div>

              <!-- Site Web -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Site web</label>
                <input
                  type="url"
                  [(ngModel)]="formData.siteWeb"
                  name="siteWeb"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://www.compagnie.sn">
              </div>

              <!-- Numéro de licence -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Numéro de licence</label>
                <input
                  type="text"
                  [(ngModel)]="formData.numeroLicence"
                  name="numeroLicence"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="LIC-2024-001">
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  [(ngModel)]="formData.description"
                  name="description"
                  rows="3"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Présentez brièvement la compagnie"></textarea>
              </div>

              <!-- Logo URL -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Logo (URL)</label>
                <input
                  type="url"
                  [(ngModel)]="formData.logo"
                  name="logo"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://cdn.compagnie.sn/logo.png">
              </div>

              <!-- Propriétaire -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Propriétaire *</label>
                <app-user-select
                  [selectedUserId]="formData.proprietaireId"
                  [allowedRoles]="ownerRoles"
                  (userSelected)="onOwnerSelected($event)">
                </app-user-select>
                <p *ngIf="!formData.proprietaireId" class="text-xs text-gray-500 mt-1">
                  Choisissez un utilisateur existant qui sera propriétaire de la compagnie.
                </p>
              </div>
            </div>

            <div *ngIf="loading" class="mt-4 text-center text-primary-600">
              Enregistrement en cours...
            </div>
            <div *ngIf="error" class="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {{ error }}
            </div>

            <div class="flex gap-3 mt-6 pt-6 border-t">
              <button 
                type="button"
                (click)="close()" 
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                Annuler
              </button>
              <button 
                type="submit"
                [disabled]="!compagnieForm.form.valid || loading"
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
export class CompagnieFormModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() compagnie: CompagnieResponse | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<CompagnieResponse>();

  TypeCompagnie = TypeCompagnie;
  readonly ownerRoles = [Role.COMPAGNIE_AERIEN, Role.COMPAGNIE_BUS];
  isEditMode = false;
  loading = false;
  error: string | null = null;

  formData: CompagnieRequest = {
    nom: '',
    type: TypeCompagnie.AEROPORT as any,
    telephone: '',
    proprietaireId: '',
    email: '',
    adresse: '',
    siteWeb: '',
    description: '',
    logo: '',
    numeroLicence: ''
  };

  constructor(private compagnieService: CompagnieServiceApi) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['compagnie']) {
      if (this.compagnie) {
        this.isEditMode = true;
        this.formData = {
          nom: this.compagnie.nom,
          type: this.compagnie.type as any,
          telephone: this.compagnie.telephone ?? '',
          proprietaireId: this.compagnie.proprietaireId ?? '',
          email: this.compagnie.email ?? '',
          adresse: this.compagnie.adresse ?? '',
          siteWeb: this.compagnie.siteWeb ?? '',
          description: this.compagnie.description ?? '',
          logo: this.compagnie.logo ?? '',
          numeroLicence: this.compagnie.numeroLicence ?? ''
        };
      } else {
        this.isEditMode = false;
        this.resetForm();
      }
    }
  }

  onSubmit() {
    this.loading = true;
    this.error = null;

    const payload = {
      ...this.formData,
      proprietaireId: this.formData.proprietaireId || undefined
    } as CompagnieRequest;

    if (this.isEditMode && this.compagnie) {
      this.compagnieService.update(this.compagnie.trackingId, payload).subscribe({
        next: (response) => {
          this.loading = false;
          this.saved.emit(response);
          this.close();
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Erreur lors de la modification';
          console.error(err);
        }
      });
    } else {
      this.compagnieService.create(payload).subscribe({
        next: (response) => {
          this.loading = false;
          this.saved.emit(response);
          this.close();
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Erreur lors de l\'ajout';
          console.error(err);
        }
      });
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

  onOwnerSelected(userId: string | null) {
    this.formData.proprietaireId = userId ?? '';
  }

  private resetForm() {
    this.formData = {
      nom: '',
      type: TypeCompagnie.AEROPORT as any,
      telephone: '',
      proprietaireId: '',
      email: '',
      adresse: '',
      siteWeb: '',
      description: '',
      logo: '',
      numeroLicence: ''
    };
    this.error = null;
  }
}
