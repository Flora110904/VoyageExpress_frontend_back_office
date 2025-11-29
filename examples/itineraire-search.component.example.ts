/**
 * Exemple de composant pour la recherche d'itinéraires
 * Ce fichier montre comment utiliser le ItineraireServiceApi
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItineraireServiceApi } from '../app/services/itineraire.service';
import { ItineraireRequest, ItineraireResponse } from '../app/models';

@Component({
  selector: 'app-itineraire-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container">
      <h2>Recherche d'itinéraires</h2>

      <!-- Formulaire de recherche -->
      <div class="search-form">
        <div class="form-row">
          <div class="form-group">
            <label>Ville de départ</label>
            <input 
              type="text" 
              [(ngModel)]="searchParams.depart" 
              class="form-control"
              placeholder="Ex: Dakar"
            />
          </div>

          <div class="form-group">
            <label>Ville d'arrivée</label>
            <input 
              type="text" 
              [(ngModel)]="searchParams.arrivee" 
              class="form-control"
              placeholder="Ex: Saint-Louis"
            />
          </div>

          <div class="form-group">
            <button (click)="searchItineraires()" class="btn btn-primary">
              🔍 Rechercher
            </button>
          </div>
        </div>
      </div>

      <!-- Résultats de recherche -->
      <div class="results" *ngIf="searchResults.length > 0">
        <h3>{{ searchResults.length }} itinéraire(s) trouvé(s)</h3>
        
        <div class="itineraire-card" *ngFor="let itineraire of searchResults">
          <div class="card-header">
            <h4>{{ itineraire.villeDepart }} → {{ itineraire.villeArrivee }}</h4>
            <span class="price">{{ itineraire.prix }} FCFA</span>
          </div>
          <div class="card-body">
            <p><strong>Date:</strong> {{ itineraire.dateDepart | date:'mediumDate' }}</p>
            <p><strong>Heure:</strong> {{ itineraire.heureDepart }}</p>
            <p><strong>Places disponibles:</strong> {{ itineraire.placeDisponible }}</p>
          </div>
          <div class="card-footer">
            <button (click)="selectItineraire(itineraire)" class="btn btn-success">
              Réserver
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="searchResults.length === 0 && searched" class="no-results">
        Aucun itinéraire trouvé pour cette recherche
      </div>

      <!-- Formulaire de création d'itinéraire (Admin) -->
      <div class="create-section">
        <h3>Créer un nouvel itinéraire</h3>
        <form (ngSubmit)="createItineraire()" #itineraireForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label>Ville de départ *</label>
              <input 
                type="text" 
                [(ngModel)]="newItineraire.villeDepart" 
                name="villeDepart"
                class="form-control" 
                required
              />
            </div>

            <div class="form-group">
              <label>Ville d'arrivée *</label>
              <input 
                type="text" 
                [(ngModel)]="newItineraire.villeArrivee" 
                name="villeArrivee"
                class="form-control" 
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Date de départ *</label>
              <input 
                type="date" 
                [(ngModel)]="newItineraire.dateDepart" 
                name="dateDepart"
                class="form-control" 
                required
              />
            </div>

            <div class="form-group">
              <label>Heure de départ *</label>
              <input 
                type="time" 
                [(ngModel)]="newItineraire.heureDepart" 
                name="heureDepart"
                class="form-control" 
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Prix (FCFA) *</label>
              <input 
                type="number" 
                [(ngModel)]="newItineraire.prix" 
                name="prix"
                class="form-control" 
                required
              />
            </div>

            <div class="form-group">
              <label>Places disponibles *</label>
              <input 
                type="number" 
                [(ngModel)]="newItineraire.placeDisponible" 
                name="placeDisponible"
                class="form-control" 
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label>Compagnie (TrackingId) *</label>
            <input 
              type="text" 
              [(ngModel)]="newItineraire.compagnieId" 
              name="compagnieId"
              class="form-control" 
              required
              placeholder="UUID de la compagnie"
            />
          </div>

          <button 
            type="submit" 
            class="btn btn-primary" 
            [disabled]="!itineraireForm.valid || creating"
          >
            {{ creating ? 'Création...' : 'Créer l\'itinéraire' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .search-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .search-form { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .form-row { display: flex; gap: 15px; margin-bottom: 15px; align-items: flex-end; }
    .form-group { flex: 1; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
    .form-control { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
    .btn { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }
    .btn-primary { background-color: #007bff; color: white; }
    .btn-success { background-color: #28a745; color: white; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .results h3 { margin-bottom: 20px; }
    .itineraire-card { 
      border: 1px solid #ddd; 
      border-radius: 8px; 
      margin-bottom: 15px; 
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .card-header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px; 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
    }
    .card-header h4 { margin: 0; font-size: 18px; }
    .price { font-size: 24px; font-weight: bold; }
    .card-body { padding: 15px; background: white; }
    .card-body p { margin: 5px 0; }
    .card-footer { padding: 15px; background: #f8f9fa; text-align: right; }
    .no-results { 
      text-align: center; 
      padding: 40px; 
      background: #f8f9fa; 
      border-radius: 8px; 
      color: #6c757d;
    }
    .create-section { 
      margin-top: 50px; 
      padding: 30px; 
      background: #fff; 
      border: 1px solid #ddd; 
      border-radius: 8px;
    }
    .create-section h3 { margin-bottom: 20px; }
  `]
})
export class ItineraireSearchComponent {
  searchParams = {
    depart: '',
    arrivee: ''
  };

  searchResults: ItineraireResponse[] = [];
  searched = false;
  creating = false;

  newItineraire: ItineraireRequest = {
    villeDepart: '',
    villeArrivee: '',
    dateDepart: '',
    heureDepart: '',
    prix: 0,
    placeDisponible: 0,
    compagnieId: ''
  };

  constructor(private itineraireService: ItineraireServiceApi) {}

  searchItineraires(): void {
    if (!this.searchParams.depart || !this.searchParams.arrivee) {
      alert('Veuillez renseigner la ville de départ et d\'arrivée');
      return;
    }

    this.itineraireService.search(
      this.searchParams.depart,
      this.searchParams.arrivee
    ).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.searched = true;
        console.log('Résultats:', results);
      },
      error: (err) => {
        console.error('Erreur de recherche:', err);
        alert('Erreur lors de la recherche');
      }
    });
  }

  selectItineraire(itineraire: ItineraireResponse): void {
    console.log('Itinéraire sélectionné:', itineraire);
    // Rediriger vers la page de réservation avec le trackingId
    alert(`Itinéraire sélectionné: ${itineraire.villeDepart} → ${itineraire.villeArrivee}`);
  }

  createItineraire(): void {
    this.creating = true;

    this.itineraireService.create(this.newItineraire).subscribe({
      next: (itineraire) => {
        console.log('Itinéraire créé:', itineraire);
        alert('Itinéraire créé avec succès!');
        this.resetForm();
        this.creating = false;
      },
      error: (err) => {
        console.error('Erreur lors de la création:', err);
        alert('Erreur lors de la création de l\'itinéraire');
        this.creating = false;
      }
    });
  }

  resetForm(): void {
    this.newItineraire = {
      villeDepart: '',
      villeArrivee: '',
      dateDepart: '',
      heureDepart: '',
      prix: 0,
      placeDisponible: 0,
      compagnieId: ''
    };
  }
}
