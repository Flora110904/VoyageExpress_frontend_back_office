import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompagnieRequest, CompagnieResponse } from '../../models/compagnie.model';
import { TypeCompagnie } from '../../models/enums.model';
import { CompagnieServiceApi } from '../../services/compagnie.service';

@Component({
  selector: 'app-compagnie-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 overflow-y-auto" (click)="closeOnBackdrop($event)">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6" (click)="$event.stopPropagation()">
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
export class CompagnieFormModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() compagnie: CompagnieResponse | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<CompagnieResponse>();

  TypeCompagnie = TypeCompagnie;
  isEditMode = false;
  loading = false;
  error: string | null = null;

  formData: CompagnieRequest = {
    nom: '',
    type: TypeCompagnie.AEROPORT as any
  };

  constructor(private compagnieService: CompagnieServiceApi) {}

  ngOnInit() {
    if (this.compagnie) {
      this.isEditMode = true;
      this.formData = {
        nom: this.compagnie.nom,
        type: this.compagnie.type as any
      };
    }
  }

  onSubmit() {
    this.loading = true;
    this.error = null;

    if (this.isEditMode && this.compagnie) {
      this.compagnieService.update(this.compagnie.trackingId, this.formData).subscribe({
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
      this.compagnieService.create(this.formData).subscribe({
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
}
