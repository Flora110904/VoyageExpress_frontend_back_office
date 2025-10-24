import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black bg-opacity-50" (click)="onCancel()"></div>
      
      <!-- Modal -->
      <div class="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
        <!-- Icon -->
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4"
             [ngClass]="iconBgClass">
          <span class="text-4xl">{{ icon }}</span>
        </div>

        <!-- Content -->
        <div class="text-center">
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ title }}</h3>
          <p class="text-gray-600 mb-6">{{ message }}</p>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3">
          <button 
            (click)="onCancel()"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors">
            {{ cancelText }}
          </button>
          <button 
            (click)="onConfirm()"
            [disabled]="loading"
            class="flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors"
            [ngClass]="confirmButtonClass">
            <span *ngIf="!loading">{{ confirmText }}</span>
            <span *ngIf="loading">⏳ Traitement...</span>
          </button>
        </div>

        <!-- Error message -->
        <div *ngIf="errorMessage" class="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.2s ease-in-out;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `]
})
export class ConfirmModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Confirmation';
  @Input() message: string = 'Êtes-vous sûr de vouloir continuer ?';
  @Input() confirmText: string = 'Confirmer';
  @Input() cancelText: string = 'Annuler';
  @Input() icon: string = '❓';
  @Input() type: 'danger' | 'warning' | 'info' = 'warning';
  @Input() loading: boolean = false;
  @Input() errorMessage: string = '';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  get iconBgClass(): string {
    const classes = {
      danger: 'bg-red-100',
      warning: 'bg-yellow-100',
      info: 'bg-blue-100'
    };
    return classes[this.type];
  }

  get confirmButtonClass(): string {
    const classes = {
      danger: 'bg-red-600 hover:bg-red-700',
      warning: 'bg-yellow-600 hover:bg-yellow-700',
      info: 'bg-blue-600 hover:bg-blue-700'
    };
    return this.loading ? 'bg-gray-400 cursor-not-allowed' : classes[this.type];
  }

  onConfirm() {
    if (!this.loading) {
      this.confirmed.emit();
    }
  }

  onCancel() {
    if (!this.loading) {
      this.cancelled.emit();
    }
  }
}
