/**
 * Exemple de composant pour la gestion des billets
 * Ce fichier montre comment utiliser le BilletServiceApi
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BilletServiceApi } from '../app/services/billet.service';
import { BilletRequest, BilletResponse } from '../app/models';

@Component({
  selector: 'app-billet-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Gestion des Billets</h2>

      <!-- Liste des billets -->
      <div class="billets-list">
        <h3>Liste des billets</h3>
        <button (click)="loadBillets()" class="btn btn-primary">
          Rafraîchir
        </button>

        <div *ngIf="loading" class="loading">
          Chargement en cours...
        </div>

        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
        </div>

        <table *ngIf="billets.length > 0" class="table">
          <thead>
            <tr>
              <th>Numéro</th>
              <th>Passager</th>
              <th>Montant</th>
              <th>Siège</th>
              <th>Classe</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let billet of billets">
              <td>{{ billet.numeroBillet }}</td>
              <td>{{ billet.prenomPassager }} {{ billet.nomPassager }}</td>
              <td>{{ billet.montant }} FCFA</td>
              <td>{{ billet.numeroSiege || 'N/A' }}</td>
              <td>{{ billet.classeVoyage || 'N/A' }}</td>
              <td>
                <span [class]="'badge ' + getStatusClass(billet.statut)">
                  {{ billet.statut }}
                </span>
              </td>
              <td>
                <button (click)="viewBillet(billet.trackingId)" class="btn btn-sm btn-info">
                  Voir
                </button>
                <button (click)="downloadPdf(billet.trackingId)" class="btn btn-sm btn-success">
                  PDF
                </button>
                <button (click)="deleteBillet(billet.trackingId)" class="btn btn-sm btn-danger">
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="billets.length === 0 && !loading" class="alert alert-info">
          Aucun billet trouvé
        </div>
      </div>

      <!-- Formulaire de création -->
      <div class="create-form">
        <h3>Créer un nouveau billet</h3>
        <form (ngSubmit)="createBillet()" #billetForm="ngForm">
          <div class="form-group">
            <label>Nom du passager *</label>
            <input 
              type="text" 
              [(ngModel)]="newBillet.nomPassager" 
              name="nomPassager"
              class="form-control" 
              required
            />
          </div>

          <div class="form-group">
            <label>Prénom du passager *</label>
            <input 
              type="text" 
              [(ngModel)]="newBillet.prenomPassager" 
              name="prenomPassager"
              class="form-control" 
              required
            />
          </div>

          <div class="form-group">
            <label>Numéro d'identité</label>
            <input 
              type="text" 
              [(ngModel)]="newBillet.numeroIdentite" 
              name="numeroIdentite"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label>Montant (FCFA) *</label>
            <input 
              type="number" 
              [(ngModel)]="newBillet.montant" 
              name="montant"
              class="form-control" 
              required
            />
          </div>

          <div class="form-group">
            <label>Numéro de siège</label>
            <input 
              type="text" 
              [(ngModel)]="newBillet.numeroSiege" 
              name="numeroSiege"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label>Classe de voyage</label>
            <select 
              [(ngModel)]="newBillet.classeVoyage" 
              name="classeVoyage"
              class="form-control"
            >
              <option value="">-- Sélectionner --</option>
              <option value="ECONOMIQUE">Économique</option>
              <option value="AFFAIRE">Affaire</option>
              <option value="PREMIERE">Première</option>
            </select>
          </div>

          <div class="form-group">
            <label>Itinéraire (TrackingId) *</label>
            <input 
              type="text" 
              [(ngModel)]="newBillet.itineraireTrackingId" 
              name="itineraireTrackingId"
              class="form-control" 
              required
              placeholder="UUID de l'itinéraire"
            />
          </div>

          <div class="form-group">
            <label>Réservation (TrackingId) - Optionnel</label>
            <input 
              type="text" 
              [(ngModel)]="newBillet.reservationTrackingId" 
              name="reservationTrackingId"
              class="form-control"
              placeholder="UUID de la réservation"
            />
          </div>

          <div class="form-group">
            <label>Statut *</label>
            <select 
              [(ngModel)]="newBillet.statut" 
              name="statut"
              class="form-control" 
              required
            >
              <option value="ACTIF">Actif</option>
              <option value="UTILISE">Utilisé</option>
              <option value="ANNULE">Annulé</option>
              <option value="EXPIRE">Expiré</option>
            </select>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary" 
            [disabled]="!billetForm.valid || creating"
          >
            {{ creating ? 'Création...' : 'Créer le billet' }}
          </button>
        </form>
      </div>

      <!-- Détails du billet sélectionné -->
      <div *ngIf="selectedBillet" class="billet-details">
        <h3>Détails du billet</h3>
        <button (click)="closeDetails()" class="btn btn-secondary">Fermer</button>
        
        <div class="details-content">
          <p><strong>Numéro:</strong> {{ selectedBillet.numeroBillet }}</p>
          <p><strong>Passager:</strong> {{ selectedBillet.prenomPassager }} {{ selectedBillet.nomPassager }}</p>
          <p><strong>N° Identité:</strong> {{ selectedBillet.numeroIdentite || 'N/A' }}</p>
          <p><strong>Montant:</strong> {{ selectedBillet.montant }} FCFA</p>
          <p><strong>Siège:</strong> {{ selectedBillet.numeroSiege || 'N/A' }}</p>
          <p><strong>Classe:</strong> {{ selectedBillet.classeVoyage || 'N/A' }}</p>
          <p><strong>Statut:</strong> {{ selectedBillet.statut }}</p>
          <p><strong>Date d'émission:</strong> {{ selectedBillet.dateEmission | date:'medium' }}</p>
          <p><strong>Date d'expiration:</strong> {{ selectedBillet.dateExpiration | date:'medium' }}</p>
          <p><strong>Utilisateur:</strong> {{ selectedBillet.utilisateurTrackingId }}</p>
          
          <div class="qr-code">
            <h4>QR Code</h4>
            <img [src]="selectedBillet.qrCode" alt="QR Code" />
          </div>

          <div class="actions">
            <button (click)="generatePdf(selectedBillet.trackingId)" class="btn btn-info">
              Générer PDF
            </button>
            <button (click)="downloadPdf(selectedBillet.trackingId)" class="btn btn-success">
              Télécharger PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .billets-list { margin-bottom: 30px; }
    .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .table th, .table td { padding: 10px; border: 1px solid #ddd; text-align: left; }
    .table th { background-color: #f4f4f4; }
    .badge { padding: 5px 10px; border-radius: 3px; }
    .badge-success { background-color: #28a745; color: white; }
    .badge-warning { background-color: #ffc107; color: black; }
    .badge-danger { background-color: #dc3545; color: white; }
    .badge-secondary { background-color: #6c757d; color: white; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
    .form-control { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .btn { padding: 8px 16px; margin-right: 5px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary { background-color: #007bff; color: white; }
    .btn-success { background-color: #28a745; color: white; }
    .btn-danger { background-color: #dc3545; color: white; }
    .btn-info { background-color: #17a2b8; color: white; }
    .btn-secondary { background-color: #6c757d; color: white; }
    .btn-sm { padding: 5px 10px; font-size: 12px; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .alert { padding: 15px; margin: 10px 0; border-radius: 4px; }
    .alert-danger { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    .alert-info { background-color: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
    .loading { padding: 20px; text-align: center; }
    .billet-details { margin-top: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 4px; }
    .qr-code img { max-width: 200px; }
  `]
})
export class BilletManagementComponent implements OnInit {
  billets: BilletResponse[] = [];
  selectedBillet: BilletResponse | null = null;
  loading = false;
  creating = false;
  error: string | null = null;

  newBillet: BilletRequest = {
    nomPassager: '',
    prenomPassager: '',
    numeroIdentite: '',
    montant: 0,
    numeroSiege: '',
    classeVoyage: '',
    statut: 'ACTIF',
    itineraireTrackingId: '',
    reservationTrackingId: ''
  };

  constructor(private billetService: BilletServiceApi) {}

  ngOnInit(): void {
    this.loadBillets();
  }

  loadBillets(): void {
    this.loading = true;
    this.error = null;

    this.billetService.list().subscribe({
      next: (billets) => {
        this.billets = billets;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des billets: ' + err.message;
        this.loading = false;
        console.error('Erreur:', err);
      }
    });
  }

  createBillet(): void {
    this.creating = true;
    this.error = null;

    this.billetService.create(this.newBillet).subscribe({
      next: (billet) => {
        console.log('Billet créé avec succès:', billet);
        this.billets.unshift(billet);
        this.resetForm();
        this.creating = false;
        alert('Billet créé avec succès!');
      },
      error: (err) => {
        this.error = 'Erreur lors de la création du billet: ' + err.message;
        this.creating = false;
        console.error('Erreur:', err);
      }
    });
  }

  viewBillet(trackingId: string): void {
    this.billetService.get(trackingId).subscribe({
      next: (billet) => {
        this.selectedBillet = billet;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des détails: ' + err.message;
        console.error('Erreur:', err);
      }
    });
  }

  generatePdf(trackingId: string): void {
    this.billetService.generatePdf(trackingId).subscribe({
      next: (billet) => {
        console.log('PDF généré:', billet.pdfUrl);
        alert('PDF généré avec succès!');
        this.loadBillets();
      },
      error: (err) => {
        this.error = 'Erreur lors de la génération du PDF: ' + err.message;
        console.error('Erreur:', err);
      }
    });
  }

  downloadPdf(trackingId: string): void {
    this.billetService.downloadPdf(trackingId).subscribe({
      next: (blob) => {
        // Créer un lien de téléchargement
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `billet-${trackingId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.error = 'Erreur lors du téléchargement du PDF: ' + err.message;
        console.error('Erreur:', err);
      }
    });
  }

  deleteBillet(trackingId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce billet?')) {
      this.billetService.delete(trackingId).subscribe({
        next: () => {
          this.billets = this.billets.filter(b => b.trackingId !== trackingId);
          alert('Billet supprimé avec succès!');
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression: ' + err.message;
          console.error('Erreur:', err);
        }
      });
    }
  }

  closeDetails(): void {
    this.selectedBillet = null;
  }

  resetForm(): void {
    this.newBillet = {
      nomPassager: '',
      prenomPassager: '',
      numeroIdentite: '',
      montant: 0,
      numeroSiege: '',
      classeVoyage: '',
      statut: 'ACTIF',
      itineraireTrackingId: '',
      reservationTrackingId: ''
    };
  }

  getStatusClass(statut: string): string {
    switch (statut) {
      case 'ACTIF':
        return 'badge-success';
      case 'UTILISE':
        return 'badge-secondary';
      case 'ANNULE':
        return 'badge-danger';
      case 'EXPIRE':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  }
}
