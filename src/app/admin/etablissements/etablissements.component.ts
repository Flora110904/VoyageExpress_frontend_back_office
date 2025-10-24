import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EtablissementResponse } from '../../models/etablissement.model';
import { TypeEtablissement } from '../../models/enums.model';
import { EtablissementServiceApi } from '../../services/etablissement.service';
import { EtablissementFormModalComponent } from './etablissement-form-modal.component';
import { EtablissementDetailModalComponent } from './etablissement-detail-modal.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal.component';

interface EtablissementExtended {
  id?: number;
  trackingId: string;
  adresse: string;
  type: TypeEtablissement;
  nom?: string;
}

@Component({
  selector: 'app-etablissements',
  imports: [CommonModule, FormsModule, EtablissementFormModalComponent, EtablissementDetailModalComponent, ConfirmModalComponent],
  templateUrl: './etablissements.component.html',
  styleUrl: './etablissements.component.css'
})
export class EtablissementsComponent implements OnInit {
  etablissements: EtablissementExtended[] = [];
  filteredEtablissements: EtablissementExtended[] = [];
  searchTerm: string = '';
  selectedType: string = 'all';
  loading: boolean = false;
  error: string | null = null;
  TypeEtablissement = TypeEtablissement;
  
  // Modal state
  isModalOpen = false;
  selectedEtablissement: EtablissementExtended | null = null;
  
  // Detail modal state
  isDetailModalOpen = false;
  etablissementToView: EtablissementExtended | null = null;
  
  // Confirm modal state
  isConfirmModalOpen = false;
  confirmModalLoading = false;
  confirmModalError = '';
  etablissementToDelete: EtablissementExtended | null = null;

  types = [
    { value: 'all', label: 'Tous les types' },
    { value: TypeEtablissement.Hotel, label: 'Hôtel' },
    { value: TypeEtablissement.Motel, label: 'Motel' },
    { value: TypeEtablissement.Appartement, label: 'Appartement' }
  ];

  constructor(private etablissementService: EtablissementServiceApi) {}

  ngOnInit() {
    this.loadEtablissements();
  }

  loadEtablissements() {
    this.loading = true;
    this.error = null;
    
    this.etablissementService.list().subscribe({
      next: (data) => {
        this.etablissements = data;
        this.filteredEtablissements = [...this.etablissements];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading etablissements:', err);
        this.error = 'Erreur lors du chargement des établissements. Veuillez vérifier votre connexion.';
        this.loading = false;
      }
    });
  }


  filterEtablissements() {
    this.filteredEtablissements = this.etablissements.filter(etab => {
      const matchesSearch = (etab.nom || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           etab.adresse.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = this.selectedType === 'all' || etab.type === this.selectedType;
      return matchesSearch && matchesType;
    });
  }

  openAddModal() {
    this.selectedEtablissement = null;
    this.isModalOpen = true;
  }

  openEditModal(etab: EtablissementExtended) {
    this.selectedEtablissement = etab;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedEtablissement = null;
  }

  openDetailModal(etab: EtablissementExtended) {
    this.etablissementToView = etab;
    this.isDetailModalOpen = true;
  }

  closeDetailModal() {
    this.isDetailModalOpen = false;
    this.etablissementToView = null;
  }

  onEditFromDetail(etab: EtablissementResponse) {
    this.closeDetailModal();
    this.openEditModal(etab as EtablissementExtended);
  }

  onEtablissementSaved(etab: EtablissementResponse) {
    // Reload fresh data from API
    this.loadEtablissements();
  }

  openDeleteConfirm(etab: EtablissementExtended) {
    this.etablissementToDelete = etab;
    this.isConfirmModalOpen = true;
    this.confirmModalError = '';
  }

  confirmDelete() {
    if (!this.etablissementToDelete) return;
    
    this.confirmModalLoading = true;
    this.confirmModalError = '';
    
    this.etablissementService.delete(this.etablissementToDelete.trackingId).subscribe({
      next: () => {
        this.confirmModalLoading = false;
        this.isConfirmModalOpen = false;
        this.loadEtablissements();
      },
      error: (err) => {
        console.error('Error deleting etablissement:', err);
        this.confirmModalError = 'Erreur lors de la suppression';
        this.confirmModalLoading = false;
      }
    });
  }

  cancelDelete() {
    this.isConfirmModalOpen = false;
    this.etablissementToDelete = null;
    this.confirmModalError = '';
  }

  getTypeColor(type: TypeEtablissement): string {
    const colors: Record<TypeEtablissement, string> = {
      [TypeEtablissement.Hotel]: 'bg-orange-100 text-orange-700',
      [TypeEtablissement.Motel]: 'bg-yellow-100 text-yellow-700',
      [TypeEtablissement.Appartement]: 'bg-blue-100 text-blue-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  }
}
