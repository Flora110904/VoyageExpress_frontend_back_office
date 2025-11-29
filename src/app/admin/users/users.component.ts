import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Role } from '../../models/enums.model';
import { UserResponse } from '../../models/user.model';
import { UserServiceApi } from '../../services/user.service';
import { UserFormModalComponent } from './user-form-modal.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal.component';
import { ActionFeedbackModalComponent, FeedbackModalType } from '../../shared/action-feedback-modal.component';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, UserFormModalComponent, ConfirmModalComponent, ActionFeedbackModalComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, OnDestroy {
  users: UserResponse[] = [];
  filteredUsers: UserResponse[] = [];
  searchTerm: string = '';
  selectedRole: string = 'all';
  Role = Role; // Expose enum to template
  loading: boolean = false;
  error: string | null = null;
  togglingUserId: string | null = null;

  // Modal state
  isModalOpen = false;
  selectedUser: UserResponse | null = null;

  private readonly activableRoles = new Set<Role>([
    Role.COMPAGNIE_AERIEN,
    Role.COMPAGNIE_BUS,
    Role.ETABLISSEMENT
  ]);

  // Confirmation modal state
  confirmModal = {
    isOpen: false,
    loading: false,
    errorMessage: '',
    title: 'Confirmation',
    message: '',
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    icon: '❓',
    type: 'warning' as 'danger' | 'warning' | 'info'
  };
  private pendingConfirmAction: (() => void) | null = null;

  // Feedback modal state
  feedbackModal = {
    isOpen: false,
    type: 'info' as FeedbackModalType,
    title: '',
    message: '',
    icon: 'ℹ️',
    buttonText: 'Fermer'
  };

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
        this.users = data.map(user => this.decorateUser(user));
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
        actif: true
      },
      {
        trackingId: 'USR-002',
        nom: 'Sow',
        prenom: 'Fatou',
        email: 'fatou.sow@email.com',
        role: Role.CLIENT,
        telephone: '+221 76 234 56 78',
        actif: true
      },
      {
        trackingId: 'USR-003',
        nom: 'Air Sénégal',
        prenom: 'Admin',
        email: 'admin@airsenegal.sn',
        role: Role.COMPAGNIE_AERIEN,
        telephone: '+221 33 865 65 65',
        actif: false
      },
      {
        trackingId: 'USR-004',
        nom: 'Ndiaye',
        prenom: 'Moussa',
        email: 'moussa.ndiaye@email.com',
        role: Role.COMPAGNIE_BUS,
        telephone: '+221 70 345 67 89',
        actif: true
      },
      {
        trackingId: 'USR-005',
        nom: 'Terrou-Bi',
        prenom: 'Manager',
        email: 'manager@terroubi.sn',
        role: Role.ETABLISSEMENT,
        telephone: '+221 33 839 90 00',
        actif: false
      },
      {
        trackingId: 'USR-006',
        nom: 'Kane',
        prenom: 'Mariama',
        email: 'mariama.kane@email.com',
        role: Role.CLIENT,
        telephone: '+221 77 456 78 90',
        actif: true
      },
      {
        trackingId: 'USR-007',
        nom: 'Fall',
        prenom: 'Ibrahima',
        email: 'ibrahima.fall@email.com',
        role: Role.ADMIN,
        telephone: '+221 76 567 89 01',
        actif: true
      },
      {
        trackingId: 'USR-008',
        nom: 'Sarr',
        prenom: 'Awa',
        email: 'awa.sarr@email.com',
        role: Role.CLIENT,
        telephone: '+221 70 678 90 12',
        actif: false
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
      const normalizedUser = this.decorateUser(user);
      const index = this.users.findIndex(u => u.trackingId === normalizedUser.trackingId);
      if (index !== -1) {
        this.users[index] = normalizedUser;
      }
    } else {
      // Add new user to list
      this.users.unshift(this.decorateUser(user));
    }
    this.filterUsers();

    const isUpdate = !!this.selectedUser;
    const title = isUpdate ? 'Utilisateur modifié' : 'Utilisateur ajouté';
    const message = isUpdate
      ? `Les informations de ${user.prenom} ${user.nom} ont été mises à jour.`
      : `${user.prenom} ${user.nom} a été ajouté avec succès.`;

    this.openFeedbackModal('success', title, message, isUpdate ? '✏️' : '✅');
  }

  viewUser(user: UserResponse) {
    console.log('View user:', user);
  }

  editUser(user: UserResponse) {
    this.openEditModal(user);
  }

  deleteUser(user: UserResponse) {
    this.openConfirmModal({
      title: 'Supprimer l\'utilisateur',
      message: `Êtes-vous sûr de vouloir supprimer ${user.prenom} ${user.nom} ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      icon: '🗑️',
      type: 'danger'
    }, () => {
      this.confirmModal.loading = true;
      this.userService.delete(user.trackingId).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.trackingId !== user.trackingId);
          this.filterUsers();
          this.closeConfirmModal();
          this.openFeedbackModal(
            'success',
            'Utilisateur supprimé',
            `${user.prenom} ${user.nom} a été supprimé avec succès.`,
            '🗑️'
          );
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          this.confirmModal.loading = false;
          this.confirmModal.errorMessage = 'Erreur lors de la suppression de l\'utilisateur.';
        }
      });
    });
  }

  countUsersByRole(role: Role): number {
    return this.users.filter(u => u.role === role).length;
  }

  getStatusLabel(user: UserResponse): string {
    return user.actif ? 'Activé' : 'Désactivé';
  }

  getStatusClass(user: UserResponse): string {
    return user.actif
      ? 'bg-emerald-100 text-emerald-700'
      : 'bg-red-100 text-red-700';
  }

  isActivable(role: Role): boolean {
    return this.activableRoles.has(role);
  }

  toggleActivation(user: UserResponse) {
    if (!this.isActivable(user.role) || this.togglingUserId === user.trackingId) {
      return;
    }

    const willActivate = !user.actif;
    const roleLabel = this.getRoleLabel(user.role);
    const actionLabel = willActivate ? 'activer' : 'désactiver';

    this.openConfirmModal({
      title: `${willActivate ? 'Activation' : 'Désactivation'} ${roleLabel}`,
      message: `Confirmez-vous vouloir ${actionLabel.toLowerCase()} ${user.prenom} ${user.nom} (${roleLabel}) ?`,
      confirmText: willActivate ? 'Activer' : 'Désactiver',
      icon: willActivate ? '✅' : '⚠️',
      type: willActivate ? 'info' : 'warning'
    }, () => {
      this.confirmModal.loading = true;
      this.togglingUserId = user.trackingId;

      const action$ = willActivate
        ? this.userService.activer(user.trackingId)
        : this.userService.desactiver(user.trackingId);

      action$.subscribe({
        next: () => {
          user.actif = willActivate;
          this.filterUsers();
          this.closeConfirmModal();
          this.openFeedbackModal(
            'success',
            'Statut mis à jour',
            `${roleLabel} ${willActivate ? 'activé' : 'désactivé'} avec succès.`,
            willActivate ? '✅' : '⚠️'
          );
        },
        error: (err) => {
          console.error('Erreur lors du changement de statut:', err);
          this.confirmModal.loading = false;
          this.confirmModal.errorMessage = 'Erreur lors de la mise à jour du statut.';
        },
        complete: () => {
          this.togglingUserId = null;
        }
      });
    });
  }

  isToggling(user: UserResponse): boolean {
    return this.togglingUserId === user.trackingId;
  }

  ngOnDestroy(): void {}

  openConfirmModal(
    config: Partial<Omit<typeof this.confirmModal, 'isOpen' | 'loading' | 'errorMessage'>>,
    action: () => void
  ) {
    this.confirmModal = {
      ...this.confirmModal,
      ...config,
      isOpen: true,
      loading: false,
      errorMessage: ''
    };
    this.pendingConfirmAction = action;
  }

  confirmModalConfirmed() {
    if (this.pendingConfirmAction) {
      this.pendingConfirmAction();
    }
  }

  closeConfirmModal() {
    this.confirmModal = {
      ...this.confirmModal,
      isOpen: false,
      loading: false,
      errorMessage: ''
    };
    this.pendingConfirmAction = null;
  }

  cancelConfirmModal() {
    if (this.confirmModal.loading) {
      return;
    }
    this.closeConfirmModal();
  }

  openFeedbackModal(type: FeedbackModalType, title: string, message: string, icon?: string) {
    this.feedbackModal = {
      isOpen: true,
      type,
      title,
      message,
      icon: icon ?? (type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️'),
      buttonText: 'Fermer'
    };
  }

  closeFeedbackModal() {
    this.feedbackModal = {
      ...this.feedbackModal,
      isOpen: false
    };
  }

  private decorateUser(user: UserResponse): UserResponse {
    return {
      ...user,
      actif: user.actif ?? false
    };
  }
}
