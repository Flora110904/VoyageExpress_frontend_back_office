import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FeedbackModalType = 'success' | 'error' | 'info';

@Component({
  selector: 'app-action-feedback-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-40" (click)="close()"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4" [ngClass]="iconBgClass">
          <span class="text-4xl">{{ icon }}</span>
        </div>
        <div class="text-center space-y-2">
          <h3 class="text-xl font-bold text-gray-900">{{ title }}</h3>
          <p class="text-gray-600">{{ message }}</p>
        </div>
        <div class="mt-6 flex justify-center">
          <button (click)="close()" class="px-6 py-2 rounded-lg font-semibold text-white" [ngClass]="buttonClass">
            {{ buttonText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.25s ease-in-out;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class ActionFeedbackModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() message = '';
  @Input() icon = 'ℹ️';
  @Input() type: FeedbackModalType = 'info';
  @Input() buttonText = 'Fermer';

  @Output() closed = new EventEmitter<void>();

  get iconBgClass(): string {
    const classes: Record<FeedbackModalType, string> = {
      success: 'bg-emerald-100',
      error: 'bg-red-100',
      info: 'bg-blue-100'
    };
    return classes[this.type];
  }

  get buttonClass(): string {
    const classes: Record<FeedbackModalType, string> = {
      success: 'bg-emerald-500 hover:bg-emerald-600',
      error: 'bg-red-500 hover:bg-red-600',
      info: 'bg-blue-500 hover:bg-blue-600'
    };
    return classes[this.type];
  }

  close(): void {
    this.closed.emit();
  }
}
