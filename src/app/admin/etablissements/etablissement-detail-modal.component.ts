import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtablissementResponse } from '../../models/etablissement.model';
import { ReservationServiceApi } from '../../services/reservation.service';
import { ReservationResponse } from '../../models/reservation.model';

@Component({
  selector: 'app-etablissement-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen && etablissement" class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="absolute inset-0 bg-black bg-opacity-50" (click)="close()"></div>
      
      <div class="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 my-8 animate-fade-in">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6 pb-4 border-b">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-2xl">
              🏨
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Établissement</h2>
              <p class="text-sm text-gray-500">{{ etablissement.trackingId }}</p>
            </div>
          </div>
          <button (click)="close()" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <!-- Content -->
        <div class="space-y-6">
          <!-- Type Badge -->
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-600">Type:</span>
            <span class="px-3 py-1 rounded-full text-sm font-semibold" [ngClass]="getTypeBadgeClass(etablissement.type)">
              {{ getTypeLabel(etablissement.type) }}
            </span>
          </div>

          <!-- Loading State -->
          <div *ngIf="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Chargement des statistiques...</p>
          </div>

          <!-- Statistics Grid -->
          <div *ngIf="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">📋</span>
                <p class="text-xs font-medium text-orange-600 uppercase">Réservations Totales</p>
              </div>
              <p class="text-3xl font-bold text-orange-900">{{ totalReservations }}</p>
              <p class="text-xs text-orange-600 mt-1">Toutes périodes</p>
            </div>

            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">✅</span>
                <p class="text-xs font-medium text-green-600 uppercase">Confirmées</p>
              </div>
              <p class="text-3xl font-bold text-green-900">{{ reservationsConfirmees }}</p>
              <p class="text-xs text-green-600 mt-1">Réservations actives</p>
            </div>

            <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">⏳</span>
                <p class="text-xs font-medium text-yellow-600 uppercase">En Attente</p>
              </div>
              <p class="text-3xl font-bold text-yellow-900">{{ reservationsEnAttente }}</p>
              <p class="text-xs text-yellow-600 mt-1">À confirmer</p>
            </div>

            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">📊</span>
                <p class="text-xs font-medium text-blue-600 uppercase">Statut</p>
              </div>
              <p class="text-lg font-bold text-blue-900 mt-2">
                <span class="inline-flex items-center gap-1">
                  <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Actif
                </span>
              </p>
            </div>
          </div>

          <!-- Reservations List -->
          <div *ngIf="!loading" class="bg-gray-50 rounded-lg p-4 mt-6">
            <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span>📋</span>
              Dernières Réservations ({{ reservations.length }})
            </h3>
            <div *ngIf="reservations.length > 0" class="space-y-2 max-h-60 overflow-y-auto">
              <div *ngFor="let reservation of reservations" class="bg-white p-3 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{{ reservation.trackingId }}</span>
                  <span class="text-xs px-2 py-1 rounded-full font-semibold" 
                        [ngClass]="{
                          'bg-green-100 text-green-700': reservation.statut === 'CONFIRMEE',
                          'bg-yellow-100 text-yellow-700': reservation.statut === 'EN_ATTENTE',
                          'bg-red-100 text-red-700': reservation.statut === 'ANNULEE'
                        }">
                    {{ reservation.statut }}
                  </span>
                </div>
                <p class="text-sm text-gray-600">📅 {{ reservation.dateReservation | date:'short' }}</p>
              </div>
            </div>
            <p *ngIf="reservations.length === 0" class="text-sm text-gray-500 italic">Aucune réservation enregistrée</p>
          </div>

          <!-- Address Info -->
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mt-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">📍</span>
              <p class="text-xs font-medium text-blue-600 uppercase">Adresse Complète</p>
            </div>
            <p class="text-lg font-bold text-blue-900">{{ etablissement.adresse }}</p>
          </div>

          <!-- Additional Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span>ℹ️</span>
              Informations supplémentaires
            </h3>
            <div class="space-y-2 text-sm text-gray-600">
              <p>• Établissement de type <strong>{{ getTypeLabel(etablissement.type) }}</strong></p>
              <p>• Situé à: <strong>{{ etablissement.adresse }}</strong></p>
              <p>• Code de suivi: <code class="bg-white px-2 py-1 rounded text-xs">{{ etablissement.trackingId }}</code></p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-6 pt-4 border-t flex gap-3">
          <button (click)="onEdit()" class="flex-1 btn btn-primary">
            ✏️ Modifier
          </button>
          <button (click)="close()" class="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
            Fermer
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.2s ease-in-out;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    code {
      font-family: 'Courier New', monospace;
    }
  `]
})
export class EtablissementDetailModalComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() etablissement?: any | null; // Accept any to handle extended types
  @Output() closed = new EventEmitter<void>();
  @Output() editRequested = new EventEmitter<EtablissementResponse>();

  reservations: ReservationResponse[] = [];
  loading: boolean = false;
  totalReservations: number = 0;
  reservationsConfirmees: number = 0;
  reservationsEnAttente: number = 0;

  constructor(private reservationService: ReservationServiceApi) {}

  ngOnChanges() {
    if (this.isOpen && this.etablissement) {
      this.loadRelatedData();
    }
  }

  loadRelatedData() {
    this.loading = true;
    this.reservations = [];

    this.reservationService.list().subscribe({
      next: (data) => {
        // Filter by etablissement (localTrackingId)
        this.reservations = data.filter(r => r.localTrackingId === this.etablissement?.trackingId);
        this.totalReservations = this.reservations.length;
        this.reservationsConfirmees = this.reservations.filter(r => r.statut === 'CONFIRMEE').length;
        this.reservationsEnAttente = this.reservations.filter(r => r.statut === 'EN_ATTENTE').length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading reservations:', err);
        this.loading = false;
      }
    });
  }

  close() {
    this.closed.emit();
  }

  onEdit() {
    if (this.etablissement) {
      this.editRequested.emit(this.etablissement);
    }
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'Hotel': '🏨 Hôtel',
      'Motel': '🏩 Motel',
      'Appartement': '🏢 Appartement'
    };
    return labels[type] || type;
  }

  getTypeBadgeClass(type: string): string {
    const classes: Record<string, string> = {
      'Hotel': 'bg-orange-100 text-orange-700',
      'Motel': 'bg-yellow-100 text-yellow-700',
      'Appartement': 'bg-blue-100 text-blue-700'
    };
    return classes[type] || 'bg-gray-100 text-gray-700';
  }
}
