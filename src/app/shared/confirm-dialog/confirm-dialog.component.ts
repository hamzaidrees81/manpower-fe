import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <nb-card class="confirm-dialog">
      <nb-card-header class="header">
        <nb-icon icon="alert-triangle-outline" status="danger"></nb-icon>
        <span class="title">{{ title || 'Confirm Action' }}</span>
      </nb-card-header>
      
      <nb-card-body class="message">
        {{ message || 'Are you sure you want to proceed?' }}
      </nb-card-body>

      <nb-card-footer class="footer">
        <button nbButton status="danger" class="confirm-btn" (click)="confirm(true)">
          <nb-icon icon="trash-2-outline"></nb-icon> Delete
        </button>
        <button nbButton status="basic" class="cancel-btn" (click)="confirm(false)">
          <nb-icon icon="close-outline"></nb-icon> Cancel
        </button>
      </nb-card-footer>
    </nb-card>
  `,
  styles: [`
    .confirm-dialog {
      width: 380px;
      text-align: center;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
      animation: fadeIn 0.3s ease-in-out;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 18px;
      font-weight: bold;
      background: #d9534f;
      color: white;
      padding: 15px;
      border-radius: 12px 12px 0 0;
    }

    .message {
      padding: 20px;
      font-size: 16px;
      color: #333;
      line-height: 1.5;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      padding: 15px;
      border-top: 1px solid #ddd;
    }

    .confirm-btn, .cancel-btn {
  border: none !important; /* Remove border */
  outline: none !important;
  box-shadow: none !important; /* Remove any focus shadow */
  border-radius: 6px;
  padding: 10px 18px;
  transition: all 0.3s ease-in-out;
}

.confirm-btn {
  background: #d9534f !important;
  color: white;
  font-weight: bold;
}

.cancel-btn {
  background: #f8f9fa !important;
  color: #333;
}

.confirm-btn:hover {
  background: #c9302c !important;
  transform: scale(1.05);
}

.cancel-btn:hover {
  background: #e2e6ea !important;
  transform: scale(1.05);
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
export class ConfirmDialogComponent {
  title: string;
  message: string;

  constructor(private ref: NbDialogRef<ConfirmDialogComponent>) {}

  confirm(result: boolean) {
    this.ref.close(result);
  }
}
