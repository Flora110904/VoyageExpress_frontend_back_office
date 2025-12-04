import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReservationDetailResponse } from '../../models/reservation.model';

@Component({
  selector: 'app-reservation-detail-modal',
  templateUrl: './reservation-detail-modal.component.html',
  styleUrls: ['./reservation-detail-modal.component.css']
})
export class ReservationDetailModalComponent {
  @Input() reservation: ReservationDetailResponse | null = null;

  constructor(public activeModal: NgbActiveModal) {}

  formatHeure(heure: string): string {
    if (!heure) return '--:--';
    return heure.substring(0, 5);
  }

  formatDate(date: string): string {
    if (!date) return '--';
    return new Date(date).toLocaleDateString('fr-FR');
  }

  formatMontant(montant: number): string {
    if (!montant) return '0 XOF';
    return `${montant.toLocaleString('fr-FR')} XOF`;
  }

  getClasseLabel(classe: string): string {
    const classes = {
      'ECONOMIQUE': 'Économique',
      'ECONOMIQUE_PREMIUM': 'Économique Premium',
      'AFFAIRES': 'Affaires',
      'PREMIERE': 'Première'
    };
    return classes[classe] || classe;
  }

  getStatutClass(statut: string): string {
    const classes = {
      'EN_ATTENTE_PAIEMENT': 'warning',
      'CONFIRMEE': 'success',
      'ANNULEE': 'danger',
      'TERMINEE': 'info'
    };
    return classes[statut] || 'secondary';
  }

  closeModal(): void {
    this.activeModal.dismiss();
  }
}
