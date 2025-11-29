import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompagnieResponse } from '../../models/compagnie.model';
import { TypeCompagnie } from '../../models/enums.model';
import { CompagnieServiceApi } from '../../services/compagnie.service';
import { CompagnieFormModalComponent } from './compagnie-form-modal.component';
import { CompagnieDetailModalComponent } from './compagnie-detail-modal.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal.component';

interface CompagnieExtended extends CompagnieResponse {
  totalVols?: number;
  totalReservations?: number;
  revenu?: string;
  status?: 'active' | 'inactive';
}

@Component({
  selector: 'app-compagnies',
  imports: [CommonModule, FormsModule, CompagnieFormModalComponent, CompagnieDetailModalComponent, ConfirmModalComponent],
  templateUrl: './compagnies.component.html',
  styleUrl: './compagnies.component.css'
})
export class CompagniesComponent implements OnInit {
  compagnies: CompagnieExtended[] = [];
  filteredCompagnies: CompagnieExtended[] = [];
  searchTerm: string = '';
  selectedType: string = 'all';
  TypeCompagnie = TypeCompagnie;
  loading: boolean = false;
  error: string | null = null;
  
  // Modal state
  isModalOpen = false;
  selectedCompagnie: CompagnieExtended | null = null;
  
  // Detail modal state
  isDetailModalOpen = false;
  compagnieToView: CompagnieExtended | null = null;
  
  // Confirm modal state
  isConfirmModalOpen = false;
  confirmModalLoading = false;
  confirmModalError = '';
  compagnieToDelete: CompagnieExtended | null = null;

  types = [
    { value: 'all', label: 'Tous les types' },
    { value: TypeCompagnie.AEROPORT, label: 'Compagnie Aérienne' }
  ];

  constructor(private compagnieService: CompagnieServiceApi) {}

  ngOnInit() {
    this.loadCompagnies();
  }

  loadCompagnies() {
    this.loading = true;
    this.error = null;
    
    this.compagnieService.list().subscribe({
      next: (data) => {
        this.compagnies = data
          .filter((compagnie) => compagnie.type === TypeCompagnie.AEROPORT)
          .map(c => ({
            ...c,
            status: 'active' as 'active' | 'inactive'
          }));
        this.filteredCompagnies = [...this.compagnies];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading compagnies:', err);
        this.error = 'Erreur lors du chargement des compagnies. Veuillez vérifier votre connexion.';
        this.loading = false;
      }
    });
  }


  filterCompagnies() {
    this.filteredCompagnies = this.compagnies.filter(compagnie => {
      const matchesSearch = compagnie.nom.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = this.selectedType === 'all' || compagnie.type === this.selectedType;
      return matchesSearch && matchesType;
    });
  }

  getTypeLabel(type: TypeCompagnie): string {
    return type === TypeCompagnie.AEROPORT ? 'Compagnie Aérienne' : 'Station de Bus';
  }

  getTypeColor(type: TypeCompagnie): string {
    return type === TypeCompagnie.AEROPORT ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700';
  }

  getTypeIcon(type: TypeCompagnie): string {
    return type === TypeCompagnie.AEROPORT ? '✈️' : '🚌';
  }

  openAddModal() {
    this.selectedCompagnie = null;
    this.isModalOpen = true;
  }

  openEditModal(compagnie: CompagnieExtended) {
    this.selectedCompagnie = compagnie;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedCompagnie = null;
  }

  onCompagnieSaved(compagnie: CompagnieResponse) {
    this.loadCompagnies(); // Reload from API
  }

  openDetailModal(compagnie: CompagnieExtended) {
    this.compagnieToView = compagnie;
    this.isDetailModalOpen = true;
  }

  closeDetailModal() {
    this.isDetailModalOpen = false;
    this.compagnieToView = null;
  }

  onEditFromDetail(compagnie: CompagnieResponse) {
    this.closeDetailModal();
    this.openEditModal(compagnie as CompagnieExtended);
  }

  openDeleteConfirm(compagnie: CompagnieExtended) {
    this.compagnieToDelete = compagnie;
    this.isConfirmModalOpen = true;
    this.confirmModalError = '';
  }

  confirmDelete() {
    if (!this.compagnieToDelete) return;
    
    this.confirmModalLoading = true;
    this.confirmModalError = '';
    
    this.compagnieService.delete(this.compagnieToDelete.trackingId).subscribe({
      next: () => {
        this.confirmModalLoading = false;
        this.isConfirmModalOpen = false;
        this.loadCompagnies(); // Reload from API
      },
      error: (err) => {
        console.error('Error deleting compagnie:', err);
        this.confirmModalError = 'Erreur lors de la suppression';
        this.confirmModalLoading = false;
      }
    });
  }

  cancelDelete() {
    this.isConfirmModalOpen = false;
    this.compagnieToDelete = null;
    this.confirmModalError = '';
  }

  editCompagnie(compagnie: CompagnieExtended) {
    this.openEditModal(compagnie);
  }

  deleteCompagnie_OLD(compagnie: CompagnieExtended) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${compagnie.nom} ?`)) {
      this.compagnieService.delete(compagnie.trackingId).subscribe({
        next: () => {
          this.compagnies = this.compagnies.filter(c => c.trackingId !== compagnie.trackingId);
          this.filterCompagnies();
          alert('Compagnie supprimée avec succès');
        },
        error: (err) => {
          console.error('Error deleting compagnie:', err);
          alert('Erreur lors de la suppression de la compagnie');
        }
      });
    }
  }

  countByType(type: TypeCompagnie): number {
    return this.compagnies.filter(c => c.type === type).length;
  }
}
