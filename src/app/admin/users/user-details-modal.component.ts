import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserResponse } from '../../models/user.model';
import { Role } from '../../models/enums.model';

@Component({
  selector: 'app-user-details-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 overflow-y-auto" (click)="closeOnBackdrop($event)">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6" (click)="$event.stopPropagation()">
          <div class="flex items-start justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Détails utilisateur</h2>
              <p class="text-sm text-gray-500">Informations fournies lors de l'inscription</p>
            </div>
            <button (click)="close()" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>

          <div *ngIf="user; else emptyState" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="p-4 bg-gray-50 rounded-lg">
                <p class="text-xs uppercase tracking-wide text-gray-500 mb-1">Nom complet</p>
                <p class="text-base font-semibold text-gray-900">{{ user.prenom }} {{ user.nom }}</p>
              </div>

              <div class="p-4 bg-gray-50 rounded-lg">
                <p class="text-xs uppercase tracking-wide text-gray-500 mb-1">Email</p>
                <p class="text-base font-semibold text-gray-900 break-all">{{ user.email }}</p>
              </div>

              <div class="p-4 bg-gray-50 rounded-lg">
                <p class="text-xs uppercase tracking-wide text-gray-500 mb-1">Téléphone</p>
                <p class="text-base font-semibold text-gray-900">{{ user.telephone }}</p>
              </div>

              <div class="p-4 bg-gray-50 rounded-lg">
                <p class="text-xs uppercase tracking-wide text-gray-500 mb-1">Rôle</p>
                <p class="text-base font-semibold text-gray-900">{{ getRoleLabel(user.role) }}</p>
              </div>

              <div class="p-4 bg-gray-50 rounded-lg">
                <p class="text-xs uppercase tracking-wide text-gray-500 mb-1">Identifiant</p>
                <p class="text-base font-semibold text-gray-900">{{ user.trackingId }}</p>
              </div>

              <div class="p-4 bg-gray-50 rounded-lg" *ngIf="user.actif !== undefined">
                <p class="text-xs uppercase tracking-wide text-gray-500 mb-1">Statut</p>
                <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                      [ngClass]="user.actif ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'">
                  <span class="w-2 h-2 rounded-full" [ngClass]="user.actif ? 'bg-emerald-500' : 'bg-red-500'"></span>
                  {{ user.actif ? 'Activé' : 'En attente d\'activation' }}
                </span>
              </div>
            </div>

            <div class="bg-primary-50 border border-primary-100 rounded-lg p-4 flex items-start gap-3" *ngIf="pendingValidationMessage">
              <span class="text-primary-500 text-xl">ℹ️</span>
              <p class="text-sm text-primary-700">{{ pendingValidationMessage }}</p>
            </div>
          </div>

          <ng-template #emptyState>
            <div class="text-center py-12 text-gray-500">Aucune information disponible.</div>
          </ng-template>

          <div class="mt-6 flex justify-end">
            <button (click)="close()" class="btn btn-primary">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserDetailsModalComponent {
  @Input() isOpen = false;
  @Input() user: UserResponse | null = null;
  @Output() closed = new EventEmitter<void>();

  Role = Role;

  get pendingValidationMessage(): string | null {
    if (!this.user) {
      return null;
    }

    if (this.user.role === Role.COMPAGNIE_AERIEN || this.user.role === Role.COMPAGNIE_BUS || this.user.role === Role.ETABLISSEMENT) {
      return this.user.actif
        ? 'Cette entité a été validée et peut accéder à son module dédié.'
        : 'Cette entité devra être validée pour accéder à son module. En attendant, elle dispose d\'un accès client.';
    }
    return null;
  }

  getRoleLabel(role: Role): string {
    switch (role) {
      case Role.ADMIN:
        return 'Administrateur';
      case Role.CLIENT:
        return 'Client';
      case Role.COMPAGNIE_AERIEN:
        return 'Compagnie aérienne';
      case Role.COMPAGNIE_BUS:
        return 'Compagnie de bus';
      case Role.ETABLISSEMENT:
        return 'Hébergement';
      default:
        return role;
    }
  }

  close() {
    this.closed.emit();
  }

  closeOnBackdrop(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.close();
    }
  }
}
