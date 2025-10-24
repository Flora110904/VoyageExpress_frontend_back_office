import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationRequest, ReservationResponse } from '../../models/reservation.model';
import { ReservationServiceApi } from '../../services/reservation.service';

@Component({
  selector: 'app-reservation-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="absolute inset-0 bg-black bg-opacity-50" (click)="close()"></div>
      
      <div class="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 my-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEditMode ? '✏️ Modifier la réservation' : '➕ Nouvelle réservation' }}
          </h2>
          <button (click)="close()" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Utilisateur ID *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.userTrakingId" 
                name="userTrakingId"
                required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="ID de l'utilisateur">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date de réservation *</label>
              <input 
                type="datetime-local" 
                [(ngModel)]="formData.dateReservation" 
                name="dateReservation"
                required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500">
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Statut *</label>
              <select 
                [(ngModel)]="formData.statut" 
                name="statut"
                required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500">
                <option value="EN_ATTENTE">En attente</option>
                <option value="CONFIRMEE">Confirmée</option>
                <option value="ANNULEE">Annulée</option>
              </select>
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
export class ReservationFormModalComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() reservation?: ReservationResponse | null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<ReservationResponse>();

  formData: ReservationRequest = {
    statut: 'EN_ATTENTE',
    dateReservation: '',
    userTrakingId: ''
  };

  loading: boolean = false;
  error: string = '';
  isEditMode: boolean = false;

  constructor(private reservationService: ReservationServiceApi) {}

  ngOnChanges() {
    if (this.reservation) {
      this.isEditMode = true;
      this.formData = {
        statut: this.reservation.statut,
        dateReservation: this.reservation.dateReservation,
        userTrakingId: this.reservation.utilisateurTrackingId
      };
    } else {
      this.isEditMode = false;
      this.resetForm();
    }
  }

  onSubmit() {
    this.loading = true;
    this.error = '';

    const request$ = this.isEditMode && this.reservation
      ? this.reservationService.update(this.reservation.trackingId, this.formData)
      : this.reservationService.create(this.formData);

    request$.subscribe({
      next: (response) => {
        this.loading = false;
        this.saved.emit(response);
        this.close();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Une erreur est survenue';
        console.error('Error saving reservation:', err);
      }
    });
  }

  close() {
    this.resetForm();
    this.closed.emit();
  }

  resetForm() {
    this.formData = {
      statut: 'EN_ATTENTE',
      dateReservation: '',
      userTrakingId: ''
    };
    this.error = '';
    this.loading = false;
  }
}
