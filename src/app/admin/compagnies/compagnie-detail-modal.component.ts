import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompagnieResponse } from '../../models/compagnie.model';
import { VehiculeServiceApi } from '../../services/vehicule.service';
import { ItineraireServiceApi } from '../../services/itineraire.service';
import { VehiculeResponse } from '../../models/vehicule.model';
import { ItineraireResponse } from '../../models/itineraire.model';

@Component({
  selector: 'app-compagnie-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen && compagnie" class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="absolute inset-0 bg-black bg-opacity-50" (click)="close()"></div>
      
      <div class="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 my-8 animate-fade-in">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6 pb-4 border-b">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl">
              {{ getTypeIcon(compagnie.type) }}
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">{{ compagnie.nom }}</h2>
              <p class="text-sm text-gray-500">{{ getTypeLabel(compagnie.type) }}</p>
            </div>
          </div>
          <button (click)="close()" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <!-- Content -->
        <div class="space-y-6">
          <!-- Type Badge -->
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-600">Type:</span>
            <span class="px-3 py-1 rounded-full text-sm font-semibold" [ngClass]="getTypeBadgeClass(compagnie.type)">
              {{ compagnie.type }}
            </span>
          </div>

          <!-- Loading State -->
          <div *ngIf="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Chargement des statistiques...</p>
          </div>

          <!-- Statistics Grid -->
          <div *ngIf="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">🚗</span>
                <p class="text-xs font-medium text-blue-600 uppercase">Véhicules</p>
              </div>
              <p class="text-3xl font-bold text-blue-900">{{ vehicules.length }}</p>
              <p class="text-xs text-blue-600 mt-1">{{ getTypeLabel(compagnie.type) === 'Compagnie Aérienne' ? 'Avions' : 'Bus' }}</p>
            </div>

            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">💺</span>
                <p class="text-xs font-medium text-purple-600 uppercase">Places Totales</p>
              </div>
              <p class="text-3xl font-bold text-purple-900">{{ totalPlaces }}</p>
              <p class="text-xs text-purple-600 mt-1">Dans tous les véhicules</p>
            </div>

            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">🗺️</span>
                <p class="text-xs font-medium text-green-600 uppercase">Itinéraires</p>
              </div>
              <p class="text-3xl font-bold text-green-900">{{ itineraires.length }}</p>
              <p class="text-xs text-green-600 mt-1">Trajets actifs</p>
            </div>

            <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">📊</span>
                <p class="text-xs font-medium text-yellow-600 uppercase">Statut</p>
              </div>
              <p class="text-lg font-bold text-yellow-900 mt-2">
                <span class="inline-flex items-center gap-1">
                  <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Actif
                </span>
              </p>
            </div>
          </div>

          <!-- Detailed Info Sections -->
          <div *ngIf="!loading" class="space-y-4 mt-6">
            <!-- Vehicules List -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>🚗</span>
                Liste des Véhicules ({{ vehicules.length }})
              </h3>
              <div *ngIf="vehicules.length > 0" class="space-y-2 max-h-40 overflow-y-auto">
                <div *ngFor="let vehicule of vehicules" class="flex items-center justify-between bg-white p-3 rounded-lg">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">{{ vehicule.type === 'AVION' ? '✈️' : '🚌' }}</span>
                    <div>
                      <p class="font-semibold text-sm">{{ vehicule.trackingId }}</p>
                      <p class="text-xs text-gray-600">{{ vehicule.type }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-primary-600">{{ vehicule.nombrePlace }}</p>
                    <p class="text-xs text-gray-500">places</p>
                  </div>
                </div>
              </div>
              <p *ngIf="vehicules.length === 0" class="text-sm text-gray-500 italic">Aucun véhicule enregistré</p>
            </div>

            <!-- Itineraires List -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>🗺️</span>
                Itinéraires Actifs ({{ itineraires.length }})
              </h3>
              <div *ngIf="itineraires.length > 0" class="space-y-2 max-h-40 overflow-y-auto">
                <div *ngFor="let itineraire of itineraires" class="bg-white p-3 rounded-lg">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <span class="font-semibold text-sm">{{ itineraire.villeDepart }}</span>
                      <span class="text-gray-400">→</span>
                      <span class="font-semibold text-sm">{{ itineraire.villeArrivee }}</span>
                    </div>
                    <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                      {{ itineraire.prix }} FCFA
                    </span>
                  </div>
                  <div class="flex items-center justify-between text-xs text-gray-600">
                    <span>⏰ {{ itineraire.heureDepart }}</span>
                    <span>💺 {{ itineraire.placeDisponible }} places</span>
                  </div>
                </div>
              </div>
              <p *ngIf="itineraires.length === 0" class="text-sm text-gray-500 italic">Aucun itinéraire actif</p>
            </div>
          </div>

          <!-- Company Basic Info -->
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mt-6">
            <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span>ℹ️</span>
              Informations de la Compagnie
            </h3>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p class="text-gray-600 mb-1">Nom complet</p>
                <p class="font-semibold">{{ compagnie.nom }}</p>
              </div>
              <div>
                <p class="text-gray-600 mb-1">Type</p>
                <p class="font-semibold">{{ getTypeLabel(compagnie.type) }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-gray-600 mb-1">ID de suivi</p>
                <code class="bg-white px-2 py-1 rounded text-xs">{{ compagnie.trackingId }}</code>
              </div>
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
export class CompagnieDetailModalComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() compagnie?: CompagnieResponse | null;
  @Output() closed = new EventEmitter<void>();
  @Output() editRequested = new EventEmitter<CompagnieResponse>();

  vehicules: VehiculeResponse[] = [];
  itineraires: ItineraireResponse[] = [];
  loading: boolean = false;
  totalPlaces: number = 0;

  constructor(
    private vehiculeService: VehiculeServiceApi,
    private itineraireService: ItineraireServiceApi
  ) {}

  ngOnChanges() {
    if (this.isOpen && this.compagnie) {
      this.loadRelatedData();
    }
  }

  loadRelatedData() {
    this.loading = true;
    this.vehicules = [];
    this.itineraires = [];
    this.totalPlaces = 0;

    // Load vehicules
    this.vehiculeService.list().subscribe({
      next: (data) => {
        // Filter by compagnie ID
        this.vehicules = data.filter(v => v.compagnieId === this.compagnie?.trackingId);
        this.totalPlaces = this.vehicules.reduce((sum, v) => sum + v.nombrePlace, 0);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading vehicules:', err);
        this.loading = false;
      }
    });

    // Load itineraires
    this.itineraireService.list().subscribe({
      next: (data) => {
        // Note: Filtering by compagnie would require compagnieId in ItineraireResponse
        // For now, show all or implement server-side filtering
        this.itineraires = data;
      },
      error: (err) => {
        console.error('Error loading itineraires:', err);
      }
    });
  }

  close() {
    this.closed.emit();
  }

  onEdit() {
    if (this.compagnie) {
      this.editRequested.emit(this.compagnie);
    }
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'AERIENNE': '✈️',
      'BUS': '🚌',
      'STATION': '🚉'
    };
    return icons[type] || '🏢';
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'AERIENNE': 'Compagnie Aérienne',
      'BUS': 'Compagnie de Bus',
      'STATION': 'Station'
    };
    return labels[type] || type;
  }

  getTypeBadgeClass(type: string): string {
    const classes: Record<string, string> = {
      'AERIENNE': 'bg-blue-100 text-blue-700',
      'BUS': 'bg-green-100 text-green-700',
      'STATION': 'bg-purple-100 text-purple-700'
    };
    return classes[type] || 'bg-gray-100 text-gray-700';
  }
}
