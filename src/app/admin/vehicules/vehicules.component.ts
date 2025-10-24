import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehiculeResponse } from '../../models/vehicule.model';
import { TypeVehicule } from '../../models/enums.model';
import { VehiculeServiceApi } from '../../services/vehicule.service';
import { VehiculeFormModalComponent } from './vehicule-form-modal.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal.component';

@Component({
  selector: 'app-vehicules',
  imports: [CommonModule, FormsModule, VehiculeFormModalComponent, ConfirmModalComponent],
  templateUrl: './vehicules.component.html',
  styleUrl: './vehicules.component.css'
})
export class VehiculesComponent implements OnInit {
  vehicules: VehiculeResponse[] = [];
  filteredVehicules: VehiculeResponse[] = [];
  searchTerm: string = '';
  selectedType: string = 'all';
  loading: boolean = false;
  error: string | null = null;
  TypeVehicule = TypeVehicule;
  
  // Modal states
  isModalOpen = false;
  selectedVehicule: VehiculeResponse | null = null;
  isConfirmModalOpen = false;
  confirmModalLoading = false;
  confirmModalError = '';
  vehiculeToDelete: VehiculeResponse | null = null;

  types = [
    { value: 'all', label: 'Tous les types' },
    { value: TypeVehicule.AVION, label: 'Avion' },
    { value: TypeVehicule.BUS, label: 'Bus' }
  ];

  constructor(private vehiculeService: VehiculeServiceApi) {}

  ngOnInit() {
    this.loadVehicules();
  }

  loadVehicules() {
    this.loading = true;
    this.error = null;

    this.vehiculeService.list().subscribe({
      next: (data) => {
        this.vehicules = data;
        this.filteredVehicules = [...this.vehicules];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading vehicules:', err);
        this.error = 'Erreur lors du chargement des véhicules. Vérifiez votre connexion.';
        this.loading = false;
      }
    });
  }


  filterVehicules() {
    this.filteredVehicules = this.vehicules.filter(veh => {
      const matchesSearch = veh.trackingId.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = this.selectedType === 'all' || veh.type === this.selectedType;
      return matchesSearch && matchesType;
    });
  }

  openAddModal() {
    this.selectedVehicule = null;
    this.isModalOpen = true;
  }

  openEditModal(vehicule: VehiculeResponse) {
    this.selectedVehicule = vehicule;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedVehicule = null;
  }

  onVehiculeSaved(vehicule: VehiculeResponse) {
    this.loadVehicules(); // Reload from API
  }

  openDeleteConfirm(vehicule: VehiculeResponse) {
    this.vehiculeToDelete = vehicule;
    this.isConfirmModalOpen = true;
    this.confirmModalError = '';
  }

  confirmDelete() {
    if (!this.vehiculeToDelete) return;
    
    this.confirmModalLoading = true;
    this.confirmModalError = '';
    
    this.vehiculeService.delete(this.vehiculeToDelete.trackingId).subscribe({
      next: () => {
        this.confirmModalLoading = false;
        this.isConfirmModalOpen = false;
        this.loadVehicules(); // Reload from API
      },
      error: (err) => {
        console.error('Error deleting vehicule:', err);
        this.confirmModalError = 'Erreur lors de la suppression';
        this.confirmModalLoading = false;
      }
    });
  }

  cancelDelete() {
    this.isConfirmModalOpen = false;
    this.vehiculeToDelete = null;
    this.confirmModalError = '';
  }

  getTypeIcon(type: TypeVehicule): string {
    return type === TypeVehicule.AVION ? '✈️' : '🚌';
  }

  getTypeColor(type: TypeVehicule): string {
    return type === TypeVehicule.AVION ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700';
  }
}
