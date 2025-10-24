import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationResponse } from '../../models/reservation.model';
import { ReservationServiceApi } from '../../services/reservation.service';
import { ReservationFormModalComponent } from './reservation-form-modal.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal.component';

interface ReservationExtended extends ReservationResponse {
  userName?: string;
  localName?: string;
}

@Component({
  selector: 'app-reservations',
  imports: [CommonModule, FormsModule, ReservationFormModalComponent, ConfirmModalComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent implements OnInit {
  reservations: ReservationExtended[] = [];
  filteredReservations: ReservationExtended[] = [];
  searchTerm: string = '';
  selectedStatut: string = 'all';
  loading: boolean = false;
  error: string | null = null;
  
  // Modal states
  isModalOpen = false;
  selectedReservation: ReservationExtended | null = null;
  isConfirmModalOpen = false;
  confirmModalLoading = false;
  confirmModalError = '';
  reservationToDelete: ReservationExtended | null = null;

  statuts = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'PENDING', label: 'En attente' },
    { value: 'CONFIRMED', label: 'Confirmée' },
    { value: 'CANCELLED', label: 'Annulée' }
  ];

  constructor(private reservationService: ReservationServiceApi) {}

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.loading = true;
    this.error = null;

    this.reservationService.list().subscribe({
      next: (data) => {
        this.reservations = data;
        this.filteredReservations = [...this.reservations];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading reservations:', err);
        this.error = 'Erreur lors du chargement des réservations. Vérifiez votre connexion.';
        this.loading = false;
      }
    });
  }


  filterReservations() {
    this.filteredReservations = this.reservations.filter(res => {
      const matchesSearch = (res.userName || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           res.trackingId.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatut = this.selectedStatut === 'all' || res.statut === this.selectedStatut;
      return matchesSearch && matchesStatut;
    });
  }

  openAddModal() {
    this.selectedReservation = null;
    this.isModalOpen = true;
  }

  openEditModal(reservation: ReservationExtended) {
    this.selectedReservation = reservation;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedReservation = null;
  }

  onReservationSaved(reservation: ReservationResponse) {
    this.loadReservations(); // Reload from API
  }

  openDeleteConfirm(reservation: ReservationExtended) {
    this.reservationToDelete = reservation;
    this.isConfirmModalOpen = true;
    this.confirmModalError = '';
  }

  confirmDelete() {
    if (!this.reservationToDelete) return;
    
    this.confirmModalLoading = true;
    this.confirmModalError = '';
    
    this.reservationService.delete(this.reservationToDelete.trackingId).subscribe({
      next: () => {
        this.confirmModalLoading = false;
        this.isConfirmModalOpen = false;
        this.loadReservations(); // Reload from API
      },
      error: (err) => {
        console.error('Error deleting reservation:', err);
        this.confirmModalError = 'Erreur lors de la suppression';
        this.confirmModalLoading = false;
      }
    });
  }

  cancelDelete() {
    this.isConfirmModalOpen = false;
    this.reservationToDelete = null;
    this.confirmModalError = '';
  }

  getStatutClass(statut: string): string {
    const classes: Record<string, string> = {
      'CONFIRMED': 'bg-green-100 text-green-700',
      'PENDING': 'bg-yellow-100 text-yellow-700',
      'CANCELLED': 'bg-red-100 text-red-700'
    };
    return classes[statut] || 'bg-gray-100 text-gray-700';
  }

  getStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      'CONFIRMED': 'Confirmée',
      'PENDING': 'En attente',
      'CANCELLED': 'Annulée'
    };
    return labels[statut] || statut;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
