import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehiculeRequest, VehiculeResponse } from '../../models/vehicule.model';
import { TypeVehicule } from '../../models/enums.model';
import { VehiculeServiceApi } from '../../services/vehicule.service';

@Component({
  selector: 'app-vehicule-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="absolute inset-0 bg-black bg-opacity-50" (click)="close()"></div>
      
      <div class="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 my-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEditMode ? '✏️ Modifier le véhicule' : '➕ Nouveau véhicule' }}
          </h2>
          <button (click)="close()" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type de véhicule *</label>
            <select 
              [(ngModel)]="formData.type" 
              name="type"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500">
              <option value="">-- Sélectionner --</option>
              <option [value]="TypeVehicule.AVION">✈️ Avion</option>
              <option [value]="TypeVehicule.BUS">🚌 Bus</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de places *</label>
            <input 
              type="number" 
              [(ngModel)]="formData.nombrePlace" 
              name="nombrePlace"
              required
              min="1"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: 200">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Compagnie ID *</label>
            <input 
              type="text" 
              [(ngModel)]="formData.compagnieTrackingId" 
              name="compagnieTrackingId"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="ID de la compagnie">
          </div>

          <div *ngIf="error" class="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {{ error }}
          </div>

          <div class="flex gap-3 pt-4">
            <button 
              type="button" 
              (click)="close()"
              class="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
              Annuler
            </button>
            <button 
              type="submit"
              [disabled]="loading"
              class="flex-1 btn btn-primary">
              <span *ngIf="!loading">{{ isEditMode ? 'Modifier' : 'Créer' }}</span>
              <span *ngIf="loading">⏳ Enregistrement...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class VehiculeFormModalComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() vehicule?: VehiculeResponse | null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<VehiculeResponse>();

  TypeVehicule = TypeVehicule;

  formData: VehiculeRequest = {
    nombrePlace: 0,
    type: '' as TypeVehicule,
    compagnieTrackingId: ''
  };

  loading: boolean = false;
  error: string = '';
  isEditMode: boolean = false;

  constructor(private vehiculeService: VehiculeServiceApi) {}

  ngOnChanges() {
    if (this.vehicule) {
      this.isEditMode = true;
      this.formData = {
        nombrePlace: this.vehicule.nombrePlace,
        type: this.vehicule.type,
        compagnieTrackingId: this.vehicule.compagnieId
      };
    } else {
      this.isEditMode = false;
      this.resetForm();
    }
  }

  onSubmit() {
    this.loading = true;
    this.error = '';

    const request$ = this.isEditMode && this.vehicule
      ? this.vehiculeService.update(this.vehicule.trackingId, this.formData)
      : this.vehiculeService.create(this.formData);

    request$.subscribe({
      next: (response) => {
        this.loading = false;
        this.saved.emit(response);
        this.close();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Une erreur est survenue';
        console.error('Error saving vehicule:', err);
      }
    });
  }

  close() {
    this.resetForm();
    this.closed.emit();
  }

  resetForm() {
    this.formData = {
      nombrePlace: 0,
      type: '' as TypeVehicule,
      compagnieTrackingId: ''
    };
    this.error = '';
    this.loading = false;
  }
}
