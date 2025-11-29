/**
 * Exemple de composant pour la gestion des utilisateurs
 * Ce fichier montre comment utiliser le UserServiceApi
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserServiceApi } from '../app/services/user.service';
import { UserRequest, UserResponse, Role, PasswordUpdateRequest } from '../app/models';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Gestion des Utilisateurs</h2>

      <!-- Filtres par rôle -->
      <div class="filters">
        <button (click)="loadAllUsers()" class="btn btn-primary">Tous</button>
        <button (click)="filterByRole(Role.ADMIN)" class="btn btn-secondary">Admins</button>
        <button (click)="filterByRole(Role.CLIENT)" class="btn btn-secondary">Clients</button>
        <button (click)="filterByRole(Role.COMPAGNIE_BUS)" class="btn btn-secondary">Compagnies Bus</button>
        <button (click)="filterByRole(Role.COMPAGNIE_AERIEN)" class="btn btn-secondary">Compagnies Aériennes</button>
        <button (click)="filterByRole(Role.ETABLISSEMENT)" class="btn btn-secondary">Établissements</button>
        <button (click)="loadNonActifs()" class="btn btn-warning">Non actifs</button>
      </div>

      <!-- Liste des utilisateurs -->
      <div class="users-list">
        <div *ngIf="loading" class="loading">Chargement...</div>
        
        <table *ngIf="!loading && users.length > 0" class="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.nom }}</td>
              <td>{{ user.prenom }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.telephone }}</td>
              <td>
                <span [class]="'badge badge-' + getRoleClass(user.role)">
                  {{ user.role }}
                </span>
              </td>
              <td>
                <button (click)="viewUser(user.trackingId)" class="btn btn-sm btn-info">
                  Voir
                </button>
                <button (click)="activerUser(user.trackingId)" class="btn btn-sm btn-success">
                  Activer
                </button>
                <button (click)="desactiverUser(user.trackingId)" class="btn btn-sm btn-warning">
                  Désactiver
                </button>
                <button (click)="deleteUser(user.trackingId)" class="btn btn-sm btn-danger">
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="!loading && users.length === 0" class="no-data">
          Aucun utilisateur trouvé
        </div>
      </div>

      <!-- Formulaire d'inscription -->
      <div class="create-form">
        <h3>Inscrire un nouvel utilisateur</h3>
        <form (ngSubmit)="inscription()" #userForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label>Nom *</label>
              <input 
                type="text" 
                [(ngModel)]="newUser.nom" 
                name="nom"
                class="form-control" 
                required
              />
            </div>

            <div class="form-group">
              <label>Prénom *</label>
              <input 
                type="text" 
                [(ngModel)]="newUser.prenom" 
                name="prenom"
                class="form-control" 
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Email *</label>
              <input 
                type="email" 
                [(ngModel)]="newUser.email" 
                name="email"
                class="form-control" 
                required
              />
            </div>

            <div class="form-group">
              <label>Téléphone *</label>
              <input 
                type="tel" 
                [(ngModel)]="newUser.telephone" 
                name="telephone"
                class="form-control" 
                required
                placeholder="+221 77 123 45 67"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Mot de passe *</label>
              <input 
                type="password" 
                [(ngModel)]="newUser.password" 
                name="password"
                class="form-control" 
                required
                minlength="6"
              />
            </div>

            <div class="form-group">
              <label>Rôle *</label>
              <select 
                [(ngModel)]="newUser.role" 
                name="role"
                class="form-control" 
                required
              >
                <option [value]="Role.ADMIN">Admin</option>
                <option [value]="Role.CLIENT">Client</option>
                <option [value]="Role.COMPAGNIE_BUS">Compagnie Bus</option>
                <option [value]="Role.COMPAGNIE_AERIEN">Compagnie Aérienne</option>
                <option [value]="Role.ETABLISSEMENT">Établissement</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary" 
            [disabled]="!userForm.valid || creating"
          >
            {{ creating ? 'Inscription...' : 'Inscrire l\'utilisateur' }}
          </button>
        </form>
      </div>

      <!-- Détails de l'utilisateur sélectionné -->
      <div *ngIf="selectedUser" class="user-details">
        <h3>Détails de l'utilisateur</h3>
        <button (click)="closeDetails()" class="btn btn-secondary">Fermer</button>
        
        <div class="details-content">
          <p><strong>Tracking ID:</strong> {{ selectedUser.trackingId }}</p>
          <p><strong>Nom complet:</strong> {{ selectedUser.prenom }} {{ selectedUser.nom }}</p>
          <p><strong>Email:</strong> {{ selectedUser.email }}</p>
          <p><strong>Téléphone:</strong> {{ selectedUser.telephone }}</p>
          <p><strong>Rôle:</strong> {{ selectedUser.role }}</p>
        </div>

        <!-- Formulaire de modification du mot de passe -->
        <div class="password-form">
          <h4>Modifier le mot de passe</h4>
          <form (ngSubmit)="modifierMotDePasse()">
            <div class="form-group">
              <label>Ancien mot de passe</label>
              <input 
                type="password" 
                [(ngModel)]="passwordUpdate.oldPassword" 
                name="oldPassword"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Nouveau mot de passe</label>
              <input 
                type="password" 
                [(ngModel)]="passwordUpdate.newPassword" 
                name="newPassword"
                class="form-control"
              />
            </div>

            <button type="submit" class="btn btn-primary">
              Modifier le mot de passe
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
    .filters { margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap; }
    .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .table th, .table td { padding: 12px; border: 1px solid #ddd; text-align: left; }
    .table th { background-color: #f4f4f4; font-weight: bold; }
    .badge { padding: 5px 10px; border-radius: 3px; font-size: 12px; }
    .badge-admin { background-color: #dc3545; color: white; }
    .badge-client { background-color: #28a745; color: white; }
    .badge-compagnie_bus { background-color: #007bff; color: white; }
    .badge-compagnie_aerien { background-color: #17a2b8; color: white; }
    .badge-etablissement { background-color: #ffc107; color: black; }
    .form-row { display: flex; gap: 15px; margin-bottom: 15px; }
    .form-group { flex: 1; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
    .form-control { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary { background-color: #007bff; color: white; }
    .btn-secondary { background-color: #6c757d; color: white; }
    .btn-success { background-color: #28a745; color: white; }
    .btn-warning { background-color: #ffc107; color: black; }
    .btn-danger { background-color: #dc3545; color: white; }
    .btn-info { background-color: #17a2b8; color: white; }
    .btn-sm { padding: 5px 10px; font-size: 12px; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .loading, .no-data { text-align: center; padding: 40px; color: #6c757d; }
    .create-form { 
      margin: 30px 0; 
      padding: 30px; 
      background: #f8f9fa; 
      border-radius: 8px;
    }
    .user-details { 
      margin-top: 30px; 
      padding: 20px; 
      border: 1px solid #ddd; 
      border-radius: 8px;
      background: white;
    }
    .details-content { margin: 20px 0; }
    .details-content p { margin: 10px 0; }
    .password-form { 
      margin-top: 30px; 
      padding-top: 30px; 
      border-top: 1px solid #ddd;
    }
  `]
})
export class UserManagementComponent implements OnInit {
  users: UserResponse[] = [];
  selectedUser: UserResponse | null = null;
  loading = false;
  creating = false;
  Role = Role; // Exposer l'enum au template

  newUser: UserRequest = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: Role.CLIENT,
    telephone: ''
  };

  passwordUpdate: PasswordUpdateRequest = {
    email: '',
    oldPassword: '',
    newPassword: ''
  };

  constructor(private userService: UserServiceApi) {}

  ngOnInit(): void {
    this.loadAllUsers();
  }

  loadAllUsers(): void {
    this.loading = true;
    this.userService.list().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('Erreur lors du chargement des utilisateurs');
        this.loading = false;
      }
    });
  }

  filterByRole(role: Role): void {
    this.loading = true;
    this.userService.findByRole(role).subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('Erreur lors du filtrage');
        this.loading = false;
      }
    });
  }

  loadNonActifs(): void {
    this.loading = true;
    this.userService.nonActifs().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('Erreur lors du chargement');
        this.loading = false;
      }
    });
  }

  inscription(): void {
    this.creating = true;
    this.userService.inscription(this.newUser).subscribe({
      next: (user) => {
        console.log('Utilisateur inscrit:', user);
        this.users.unshift(user);
        this.resetForm();
        this.creating = false;
        alert('Utilisateur inscrit avec succès!');
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('Erreur lors de l\'inscription: ' + (err.error?.message || err.message));
        this.creating = false;
      }
    });
  }

  viewUser(trackingId: string): void {
    this.userService.get(trackingId).subscribe({
      next: (user) => {
        this.selectedUser = user;
        this.passwordUpdate.email = user.email;
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('Erreur lors du chargement des détails');
      }
    });
  }

  activerUser(trackingId: string): void {
    this.userService.activer(trackingId).subscribe({
      next: (message) => {
        console.log('Réponse:', message);
        alert('Utilisateur activé avec succès!');
        this.loadAllUsers();
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('Erreur lors de l\'activation');
      }
    });
  }

  desactiverUser(trackingId: string): void {
    this.userService.desactiver(trackingId).subscribe({
      next: (message) => {
        console.log('Réponse:', message);
        alert('Utilisateur désactivé avec succès!');
        this.loadAllUsers();
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('Erreur lors de la désactivation');
      }
    });
  }

  deleteUser(trackingId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      this.userService.delete(trackingId).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.trackingId !== trackingId);
          alert('Utilisateur supprimé avec succès!');
        },
        error: (err) => {
          console.error('Erreur:', err);
          alert('Erreur lors de la suppression');
        }
      });
    }
  }

  modifierMotDePasse(): void {
    if (!this.passwordUpdate.oldPassword || !this.passwordUpdate.newPassword) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    this.userService.modifierMotDePasse(this.passwordUpdate).subscribe({
      next: (message) => {
        console.log('Réponse:', message);
        alert('Mot de passe modifié avec succès!');
        this.passwordUpdate.oldPassword = '';
        this.passwordUpdate.newPassword = '';
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('Erreur lors de la modification du mot de passe');
      }
    });
  }

  closeDetails(): void {
    this.selectedUser = null;
    this.passwordUpdate = {
      email: '',
      oldPassword: '',
      newPassword: ''
    };
  }

  resetForm(): void {
    this.newUser = {
      nom: '',
      prenom: '',
      email: '',
      password: '',
      role: Role.CLIENT,
      telephone: ''
    };
  }

  getRoleClass(role: Role): string {
    return role.toLowerCase().replace(/_/g, '_');
  }
}
