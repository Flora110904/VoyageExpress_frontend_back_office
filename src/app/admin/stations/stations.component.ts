import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompagnieResponse } from '../../models/compagnie.model';
import { TypeCompagnie } from '../../models/enums.model';
import { CompagnieServiceApi } from '../../services/compagnie.service';
import { StationFormModalComponent } from './station-form-modal.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal.component';

interface StationExtended extends CompagnieResponse {
  trajets?: number;
  status?: 'active' | 'inactive';
}

@Component({
  selector: 'app-stations',
  imports: [CommonModule, FormsModule, StationFormModalComponent, ConfirmModalComponent],
  templateUrl: './stations.component.html',
  styleUrl: './stations.component.css'
})
export class StationsComponent implements OnInit {
  stations: StationExtended[] = [];
  filteredStations: StationExtended[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  error: string | null = null;
  
  // Modal state
  isModalOpen = false;
  selectedStation: StationExtended | null = null;
  
  // Confirm modal state
  isConfirmModalOpen = false;
  confirmModalLoading = false;
  confirmModalError = '';
  stationToDelete: StationExtended | null = null;

  constructor(private compagnieService: CompagnieServiceApi) {}

  ngOnInit() {
    this.loadStations();
  }

  loadStations() {
    this.loading = true;
    this.error = null;
    
    // Load only stations (TypeCompagnie.STATION)
    this.compagnieService.list().subscribe({
      next: (data) => {
        this.stations = data
          .filter(c => c.type === TypeCompagnie.STATION)
          .map(s => ({ ...s, status: 'active' as 'active' | 'inactive' }));
        this.filteredStations = [...this.stations];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading stations:', err);
        this.error = 'Erreur lors du chargement des stations. Veuillez vérifier votre connexion.';
        this.loading = false;
      }
    });
  }


  filterStations() {
    this.filteredStations = this.stations.filter(station => 
      station.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openAddModal() {
    this.selectedStation = null;
    this.isModalOpen = true;
  }

  openEditModal(station: StationExtended) {
    this.selectedStation = station;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedStation = null;
  }

  onStationSaved(station: CompagnieResponse) {
    this.loadStations(); // Reload from API
  }

  openDeleteConfirm(station: StationExtended) {
    this.stationToDelete = station;
    this.isConfirmModalOpen = true;
    this.confirmModalError = '';
  }

  confirmDelete() {
    if (!this.stationToDelete) return;
    
    this.confirmModalLoading = true;
    this.confirmModalError = '';
    
    this.compagnieService.delete(this.stationToDelete.trackingId).subscribe({
      next: () => {
        this.confirmModalLoading = false;
        this.isConfirmModalOpen = false;
        this.loadStations(); // Reload from API
      },
      error: (err) => {
        console.error('Error deleting station:', err);
        this.confirmModalError = 'Erreur lors de la suppression';
        this.confirmModalLoading = false;
      }
    });
  }

  cancelDelete() {
    this.isConfirmModalOpen = false;
    this.stationToDelete = null;
    this.confirmModalError = '';
  }
}
