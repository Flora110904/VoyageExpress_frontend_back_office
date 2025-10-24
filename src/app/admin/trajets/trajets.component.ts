import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItineraireResponse } from '../../models/itineraire.model';
import { ItineraireServiceApi } from '../../services/itineraire.service';
import { TrajetFormModalComponent } from './trajet-form-modal.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal.component';

@Component({
  selector: 'app-trajets',
  imports: [CommonModule, FormsModule, TrajetFormModalComponent, ConfirmModalComponent],
  templateUrl: './trajets.component.html',
  styleUrl: './trajets.component.css'
})
export class TrajetsComponent implements OnInit {
  trajets: ItineraireResponse[] = [];
  filteredTrajets: ItineraireResponse[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  error: string | null = null;
  
  // Modal states
  isModalOpen = false;
  selectedTrajet: ItineraireResponse | null = null;
  isConfirmModalOpen = false;
  confirmModalLoading = false;
  confirmModalError = '';
  trajetToDelete: ItineraireResponse | null = null;

  constructor(private itineraireService: ItineraireServiceApi) {}

  ngOnInit() {
    this.loadTrajets();
  }

  loadTrajets() {
    this.loading = true;
    this.error = null;

    this.itineraireService.list().subscribe({
      next: (data) => {
        this.trajets = data;
        this.filteredTrajets = [...this.trajets];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading trajets:', err);
        this.error = 'Erreur lors du chargement des trajets. Vérifiez votre connexion.';
        this.loading = false;
      }
    });
  }


  filterTrajets() {
    this.filteredTrajets = this.trajets.filter(trajet =>
      trajet.villeDepart.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      trajet.villeArrivee.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openAddModal() {
    this.selectedTrajet = null;
    this.isModalOpen = true;
  }

  openEditModal(trajet: ItineraireResponse) {
    this.selectedTrajet = trajet;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedTrajet = null;
  }

  onTrajetSaved(trajet: ItineraireResponse) {
    this.loadTrajets(); // Reload from API
  }

  openDeleteConfirm(trajet: ItineraireResponse) {
    this.trajetToDelete = trajet;
    this.isConfirmModalOpen = true;
    this.confirmModalError = '';
  }

  confirmDelete() {
    if (!this.trajetToDelete) return;
    
    this.confirmModalLoading = true;
    this.confirmModalError = '';
    
    this.itineraireService.delete(this.trajetToDelete.trackingId).subscribe({
      next: () => {
        this.confirmModalLoading = false;
        this.isConfirmModalOpen = false;
        this.loadTrajets(); // Reload from API
      },
      error: (err) => {
        console.error('Error deleting trajet:', err);
        this.confirmModalError = 'Erreur lors de la suppression';
        this.confirmModalLoading = false;
      }
    });
  }

  cancelDelete() {
    this.isConfirmModalOpen = false;
    this.trajetToDelete = null;
    this.confirmModalError = '';
  }
}
