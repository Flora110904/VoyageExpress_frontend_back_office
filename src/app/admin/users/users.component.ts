import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Role } from '../../models/enums.model';
import { UserResponse } from '../../models/user.model';
import { UserServiceApi } from '../../services/user.service';
import { UserFormModalComponent } from './user-form-modal.component';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, UserFormModalComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: UserResponse[] = [];
  filteredUsers: UserResponse[] = [];
  searchTerm: string = '';
  selectedRole: string = 'all';
  Role = Role; // Expose enum to template
  loading: boolean = false;
  error: string | null = null;
  
  // Modal state
  isModalOpen = false;
  selectedUser: UserResponse | null = null;
  
  roles = [
    { value: 'all', label: 'Tous les rôles' },
    { value: Role.ADMIN, label: 'Administrateur' },
    { value: Role.CLIENT, label: 'Client' },
    { value: Role.COMPAGNIE_AERIEN, label: 'Compagnie Aérienne' },
    { value: Role.COMPAGNIE_BUS, label: 'Compagnie Bus' },
    { value: Role.ETABLISSEMENT, label: 'Établissement' }
  ];

  constructor(private userService: UserServiceApi) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = null;
    
    this.userService.list().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...this.users];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error = 'Erreur lors du chargement des utilisateurs';
        this.loading = false;
        // Fallback to mock data in case of error
        this.loadMockUsers();
      }
    });
  }

  loadMockUsers() {
    this.users = [
      {
        trackingId: 'USR-001',
        nom: 'Diallo',
        prenom: 'Amadou',
        email: 'amadou.diallo@email.com',
        role: Role.CLIENT,
        telephone: '+221 77 123 45 67',
        actif: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        trackingId: 'USR-002',
        nom: 'Sow',
        prenom: 'Fatou',
        email: 'fatou.sow@email.com',
        role: Role.CLIENT,
        telephone: '+221 76 234 56 78',
        actif: true,
        createdAt: '2024-01-16T11:00:00Z',
        updatedAt: '2024-01-16T11:00:00Z'
      },
      {
        trackingId: 'USR-003',
        nom: 'Air Sénégal',
        prenom: 'Admin',
        email: 'admin@airsenegal.sn',
        role: Role.COMPAGNIE_AERIEN,
        telephone: '+221 33 865 65 65',
        actif: true,
        createdAt: '2024-01-17T09:00:00Z',
        updatedAt: '2024-01-17T09:00:00Z'
      },
      {
        trackingId: 'USR-004',
        nom: 'Ndiaye',
        prenom: 'Moussa',
        email: 'moussa.ndiaye@email.com',
        role: Role.COMPAGNIE_BUS,
        telephone: '+221 70 345 67 89',
        actif: true,
        createdAt: '2024-01-18T14:00:00Z',
        updatedAt: '2024-01-18T14:00:00Z'
      },
      {
        trackingId: 'USR-005',
        nom: 'Terrou-Bi',
        prenom: 'Manager',
        email: 'manager@terroubi.sn',
        role: Role.ETABLISSEMENT,
        telephone: '+221 33 839 90 00',
        actif: true,
        createdAt: '2024-01-19T08:00:00Z',
        updatedAt: '2024-01-19T08:00:00Z'
      },
      {
        trackingId: 'USR-006',
        nom: 'Kane',
        prenom: 'Mariama',
        email: 'mariama.kane@email.com',
        role: Role.CLIENT,
        telephone: '+221 77 456 78 90',
        actif: true,
        createdAt: '2024-01-20T13:00:00Z',
        updatedAt: '2024-01-20T13:00:00Z'
      },
      {
        trackingId: 'USR-007',
        nom: 'Fall',
        prenom: 'Ibrahima',
        email: 'ibrahima.fall@email.com',
        role: Role.ADMIN,
        telephone: '+221 76 567 89 01',
        actif: true,
        createdAt: '2024-01-21T10:00:00Z',
        updatedAt: '2024-01-21T10:00:00Z'
      },
      {
        trackingId: 'USR-008',
        nom: 'Sarr',
        prenom: 'Awa',
        email: 'awa.sarr@email.com',
        role: Role.CLIENT,
        telephone: '+221 70 678 90 12',
        actif: true,
        createdAt: '2024-01-22T15:00:00Z',
        updatedAt: '2024-01-22T15:00:00Z'
      }
    ];
    this.filteredUsers = [...this.users];
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = 
        user.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.telephone.includes(this.searchTerm);
      
      const matchesRole = this.selectedRole === 'all' || user.role === this.selectedRole;
      
      return matchesSearch && matchesRole;
    });
  }

  getRoleColor(role: Role): string {
    const colors: Record<Role, string> = {
      [Role.ADMIN]: 'bg-purple-100 text-purple-700',
      [Role.CLIENT]: 'bg-blue-100 text-blue-700',
      [Role.COMPAGNIE_AERIEN]: 'bg-indigo-100 text-indigo-700',
      [Role.COMPAGNIE_BUS]: 'bg-green-100 text-green-700',
      [Role.ETABLISSEMENT]: 'bg-orange-100 text-orange-700'
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  }

  getRoleLabel(role: Role): string {
    const labels: Record<Role, string> = {
      [Role.ADMIN]: 'Admin',
      [Role.CLIENT]: 'Client',
      [Role.COMPAGNIE_AERIEN]: 'Compagnie Aérienne',
      [Role.COMPAGNIE_BUS]: 'Station Bus',
      [Role.ETABLISSEMENT]: 'Établissement'
    };
    return labels[role] || role;
  }

  openAddModal() {
    this.selectedUser = null;
    this.isModalOpen = true;
  }

  openEditModal(user: UserResponse) {
    this.selectedUser = user;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedUser = null;
  }

  onUserSaved(user: UserResponse) {
    if (this.selectedUser) {
      // Update existing user in list
      const index = this.users.findIndex(u => u.trackingId === user.trackingId);
      if (index !== -1) {
        this.users[index] = user;
      }
    } else {
      // Add new user to list
      this.users.unshift(user);
    }
    this.filterUsers();
    alert(this.selectedUser ? 'Utilisateur modifié avec succès!' : 'Utilisateur ajouté avec succès!');
  }

  viewUser(user: UserResponse) {
    console.log('View user:', user);
  }

  editUser(user: UserResponse) {
    this.openEditModal(user);
  }

  deleteUser(user: UserResponse) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${user.prenom} ${user.nom} ?`)) {
      this.userService.delete(user.trackingId).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.trackingId !== user.trackingId);
          this.filterUsers();
          alert('Utilisateur supprimé avec succès');
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Erreur lors de la suppression de l\'utilisateur');
        }
      });
    }
  }

  countUsersByRole(role: Role): number {
    return this.users.filter(u => u.role === role).length;
  }
}
