import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EtablissementRequest, EtablissementResponse } from '../../models/etablissement.model';
import { TypeEtablissement } from '../../models/enums.model';
import { EtablissementServiceApi } from '../../services/etablissement.service';
import { UserSelectComponent } from '../../shared/user-select.component';

@Component({
  selector: 'app-etablissement-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, UserSelectComponent],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 overflow-y-auto" (click)="closeOnBackdrop($event)">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">
              {{ isEditMode ? 'Modifier l\'établissement' : 'Nouvel établissement' }}
            </h2>
            <button (click)="close()" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>

          <form (ngSubmit)="onSubmit()" #etablissementForm="ngForm">
            <div class="space-y-4">
              <!-- Adresse -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                <input 
                  type="text" 
                  [(ngModel)]="formData.adresse" 
                  name="adresse"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Dakar, Route de l'Aéroport">
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
                  <option [value]="TypeEtablissement.Hotel">Hôtel</option>
                  <option [value]="TypeEtablissement.Motel">Motel</option>
                  <option [value]="TypeEtablissement.Appartement">Appartement</option>
                </select>
              </div>

              <!-- Propriétaire ID -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Propriétaire *</label>
                <app-user-select
                  [selectedUserId]="formData.proprietaireId"
                  (userSelected)="onOwnerSelected($event)">
                </app-user-select>
                <p *ngIf="!formData.proprietaireId" class="text-xs text-gray-500 mt-1">
                  Sélectionnez un utilisateur qui sera propriétaire de l'établissement.
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
                [disabled]="!etablissementForm.form.valid || loading"
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
export class EtablissementFormModalComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() etablissement?: any | null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<EtablissementResponse>();

  TypeEtablissement = TypeEtablissement;
  isEditMode = false;
  loading = false;
  error: string | null = null;

  formData: EtablissementRequest = {
    adresse: '',
    type: TypeEtablissement.Hotel,
    proprietaireId: ''
  };

  constructor(private etablissementService: EtablissementServiceApi) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['etablissement']) {
      if (this.etablissement) {
        this.isEditMode = true;
        this.formData = {
          adresse: this.etablissement.adresse,
          type: this.etablissement.type,
          proprietaireId: this.etablissement.proprietaireId ?? ''
        };
      } else {
        this.isEditMode = false;
        this.resetForm();
      }
    }
  }

  resetForm() {
    this.formData = {
      adresse: '',
      type: TypeEtablissement.Hotel,
      proprietaireId: ''
    };
    this.error = null;
  }

  onSubmit() {
    this.loading = true;
    this.error = null;

    const payload = {
      ...this.formData,
      proprietaireId: this.formData.proprietaireId || undefined
    } as EtablissementRequest;

    if (this.isEditMode && this.etablissement) {
      this.etablissementService.update(this.etablissement.trackingId, payload).subscribe({
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
      this.etablissementService.create(payload).subscribe({
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
}
