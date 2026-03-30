import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';

@Component({
  selector: 'shpp-april-fools-modal',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ rickRolled ? '🎉 April Fools!' : '🐛 Report a Bug' }}</h4>
      <button type="button" class="btn-close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <ng-container *ngIf="!rickRolled">
        <p>Found a bug? We take all reports seriously. Click below to submit your report to our dedicated bug-fixing team.</p>
      </ng-container>
      <ng-container *ngIf="rickRolled">
        <p class="text-center fs-4">There are no bugs, only features! 😄</p>
        <p class="text-center text-muted">Hope you enjoyed your visit with Rick.</p>
      </ng-container>
    </div>
    <div class="modal-footer">
      <ng-container *ngIf="!rickRolled">
        <a class="btn btn-primary" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&autoplay=1" target="_blank" (click)="rickRolled = true">Submit Report</a>
      </ng-container>
      <ng-container *ngIf="rickRolled">
        <button type="button" class="btn btn-secondary" (click)="activeModal.close()">Close</button>
      </ng-container>
    </div>
  `
})
export class AprilFoolsModalComponent {
  activeModal = inject(NgbActiveModal);
  rickRolled = false;
}
