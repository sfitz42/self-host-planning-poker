import { Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AprilFoolsModalComponent } from './april-fools-modal.component';

@Component({
  selector: 'shpp-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [ TranslocoDirective ]
})
export class FooterComponent {
  constructor(private modalService: NgbModal) {}

  reportBug(): void {
    this.modalService.open(AprilFoolsModalComponent);
  }
}
