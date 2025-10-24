import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItineraireRequest, ItineraireResponse } from '../../models/itineraire.model';
import { ItineraireServiceApi } from '../../services/itineraire.service';

@Component({
  selector: 'app-trajet-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="absolute inset-0 bg-black bg-opacity-50" (click)="close()"></div>
      
      <div class="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 my-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEditMode ? '✏️ Modifier le trajet' : '➕ Nouveau trajet' }}
          </h2>
          <button (click)="close()" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ville de départ *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.villeDepart" 
                name="villeDepart"
                required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: Dakar">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ville d'arrivée *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.villeArrivee" 
                name="villeArrivee"
                required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: Paris">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date de départ *</label>
              <input 
                type="date" 
                [(ngModel)]="formData.dateDepart" 
                name="dateDepart"
                required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Heure de départ *</label>
              <input 
                type="time" 
                [(ngModel)]="formData.heureDepart" 
                name="heureDepart"
                required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA) *</label>
              <input 
                type="number" 
                [(ngModel)]="formData.prix" 
                name="prix"
                required
                min="0"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="0">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Places disponibles *</label>
              <input 
                type="number" 
                [(ngModel)]="formData.placeDisponible" 
                name="placeDisponible"
                required
                min="0"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="0">
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Compagnie ID *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.compagnieId" 
                name="compagnieId"
                required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="ID de la compagnie">
            </div>
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
export class TrajetFormModalComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() trajet?: ItineraireResponse | null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<ItineraireResponse>();

  formData: ItineraireRequest = {
    villeDepart: '',
    villeArrivee: '',
    dateDepart: '',
    heureDepart: '',
    prix: 0,
    placeDisponible: 0,
    compagnieId: ''
  };

  loading: boolean = false;
  error: string = '';
  isEditMode: boolean = false;

  constructor(private itineraireService: ItineraireServiceApi) {}

  ngOnChanges() {
    if (this.trajet) {
      this.isEditMode = true;
      this.formData = {
        villeDepart: this.trajet.villeDepart,
        villeArrivee: this.trajet.villeArrivee,
        dateDepart: this.trajet.dateDepart,
        heureDepart: this.trajet.heureDepart,
        prix: this.trajet.prix,
        placeDisponible: this.trajet.placeDisponible,
        compagnieId: '' // Not available in response
      };
    } else {
      this.isEditMode = false;
      this.resetForm();
    }
  }

  onSubmit() {
    this.loading = true;
    this.error = '';

    const request$ = this.isEditMode && this.trajet
      ? this.itineraireService.update(this.trajet.trackingId, this.formData)
      : this.itineraireService.create(this.formData);

    request$.subscribe({
      next: (response) => {
        this.loading = false;
        this.saved.emit(response);
        this.close();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Une erreur est survenue';
        console.error('Error saving trajet:', err);
      }
    });
  }

  close() {
    this.resetForm();
    this.closed.emit();
  }

  resetForm() {
    this.formData = {
      villeDepart: '',
      villeArrivee: '',
      dateDepart: '',
      heureDepart: '',
      prix: 0,
      placeDisponible: 0,
      compagnieId: ''
    };
    this.error = '';
    this.loading = false;
  }
}
