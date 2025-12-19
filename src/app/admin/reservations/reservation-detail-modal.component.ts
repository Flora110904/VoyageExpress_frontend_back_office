import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationDetailResponse } from '../../models/reservation.model';

@Component({
  selector: 'app-reservation-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 overflow-y-auto" (click)="onBackdropClick($event)">
      <div class="fixed inset-0 bg-black bg-opacity-40"></div>
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6" (click)="$event.stopPropagation()">
          <div class="flex items-start justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Détails de la réservation</h2>
              <p class="text-sm text-gray-500">Informations fournies lors de la création</p>
            </div>
            <button type="button" (click)="close()" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>

          <ng-container *ngIf="reservation as detail; else noReservation">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1">
                <p class="text-xs uppercase tracking-wide text-gray-500">Référence</p>
                <p class="text-base font-semibold text-gray-900">{{ detail.numeroReservation || detail.trackingId }}</p>
              </div>

              <div class="space-y-1">
                <p class="text-xs uppercase tracking-wide text-gray-500">Client</p>
                <p class="text-base font-semibold text-gray-900">{{ detail.userName || 'Client inconnu' }}</p>
                <p class="text-sm text-gray-500" *ngIf="detail.userEmail">{{ detail.userEmail }}</p>
                <p class="text-sm text-gray-500" *ngIf="detail.userTelephone">{{ detail.userTelephone }}</p>
              </div>

              <div class="space-y-1">
                <p class="text-xs uppercase tracking-wide text-gray-500">Type</p>
                <p class="text-base font-semibold text-gray-900">{{ getTypeLabel(detail) }}</p>
              </div>

              <div class="space-y-1">
                <p class="text-xs uppercase tracking-wide text-gray-500">Classe</p>
                <p class="text-base font-semibold text-gray-900">{{ getClasseLabel(detail.classeVoyage) }}</p>
              </div>

              <div class="space-y-1">
                <p class="text-xs uppercase tracking-wide text-gray-500">Date de réservation</p>
                <p class="text-base font-semibold text-gray-900">{{ formatDate(detail.dateReservation) }}</p>
              </div>

              <div class="space-y-1">
                <p class="text-xs uppercase tracking-wide text-gray-500">Bagage inclus</p>
                <p class="text-base font-semibold text-gray-900">{{ detail.bagageInclusKg }} kg</p>
                <p class="text-sm text-gray-500" *ngIf="detail.bagageSupplementaireKg">
                  + {{ detail.bagageSupplementaireKg }} kg supplémentaires
                </p>
              </div>

              <div class="space-y-1">
                <p class="text-xs uppercase tracking-wide text-gray-500">Montant total</p>
                <p class="text-base font-semibold text-gray-900">{{ formatMontant(detail.montantTotal) }}</p>
              </div>

              <div class="space-y-1">
                <p class="text-xs uppercase tracking-wide text-gray-500">Statut</p>
                <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                      [ngClass]="getStatutClass(detail.statut)">
                  {{ getStatutLabel(detail.statut) }}
                </span>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6" *ngIf="detail.itineraireDetails as itineraire">
              <div class="space-y-2 p-4 bg-slate-50 rounded-lg">
                <p class="text-xs uppercase tracking-wide text-gray-500">Itinéraire</p>
                <p class="text-sm text-gray-700">
                  {{ itineraire.villeDepart }} → {{ itineraire.villeArrivee }}
                </p>
                <p class="text-sm text-gray-500" *ngIf="itineraire.dateDepart">
                  Départ le {{ formatDate(itineraire.dateDepart) }} à {{ formatHeure(itineraire.heureDepart || '') }}
                </p>
              </div>

              <div class="space-y-2 p-4 bg-slate-50 rounded-lg" *ngIf="detail.localDetails as local">
                <p class="text-xs uppercase tracking-wide text-gray-500">Hébergement</p>
                <p class="text-sm text-gray-700">{{ local.description || 'Local associé' }}</p>
                <p class="text-sm text-gray-500" *ngIf="local.type">Type: {{ local.type }}</p>
                <p class="text-sm text-gray-500" *ngIf="local.equipements?.length">
                  Équipements: {{ (local.equipements || []).join(', ') }}
                </p>
              </div>
            </div>
          </ng-container>

          <ng-template #noReservation>
            <div class="text-center py-12 text-gray-500">Aucune information à afficher.</div>
          </ng-template>

          <div class="mt-6 flex justify-end">
            <button type="button" (click)="close()" class="btn btn-primary">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ReservationDetailModalComponent {
  @Input() reservation: ReservationDetailResponse | null = null;
  @Output() closed = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  formatHeure(heure: string | undefined): string {
    if (!heure) return '--:--';
    return heure.substring(0, 5);
  }

  formatDate(date: string | undefined): string {
    if (!date) return '--';
    return new Date(date).toLocaleDateString('fr-FR');
  }

  formatMontant(montant: number): string {
    if (!montant) return '0 XOF';
    return `${montant.toLocaleString('fr-FR')} XOF`;
  }

  getClasseLabel(classe: string): string {
    const classes: Record<string, string> = {
      ECONOMIQUE: 'Économique',
      ECONOMIQUE_PREMIUM: 'Économique Premium',
      AFFAIRES: 'Affaires',
      PREMIERE: 'Première'
    };
    return classes[classe] || classe;
  }

  getTypeLabel(reservation: ReservationDetailResponse): string {
    if (reservation.itineraireTrackingId) {
      return 'Transport';
    }
    if (reservation.localTrackingId) {
      return 'Hébergement';
    }
    return 'Réservation';
  }

  getStatutClass(statut: string): string {
    const classes: Record<string, string> = {
      EN_ATTENTE_PAIEMENT: 'bg-amber-100 text-amber-700',
      CONFIRMEE: 'bg-emerald-100 text-emerald-700',
      ANNULEE: 'bg-red-100 text-red-700',
      TERMINEE: 'bg-blue-100 text-blue-700'
    };
    return classes[statut] || 'bg-gray-100 text-gray-700';
  }

  getStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      EN_ATTENTE_PAIEMENT: 'En attente de paiement',
      CONFIRMEE: 'Confirmée',
      ANNULEE: 'Annulée',
      TERMINEE: 'Terminée'
    };
    return labels[statut] || statut;
  }

  close(): void {
    this.closed.emit();
  }
}
