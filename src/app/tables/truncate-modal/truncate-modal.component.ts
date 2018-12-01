import { Component, Input, TemplateRef } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-truncate-modal',
  templateUrl: './truncate-modal.component.html',
  styles: [`
  .modal-link {
      color: #363636;
  }

  .modal-link:hover {
      color: #363636;
      text-decoration: underline;
  }`]
})
export class TruncateModalComponent {

  @Input() column: string;
  @Input() value: string;
  @Input() preformatted: boolean;
  // This will contain a reference to the modal displayed as part of the openModal method
  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) { }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
