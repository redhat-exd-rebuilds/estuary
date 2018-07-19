import { Component, OnDestroy, TemplateRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { SiblingsService } from '../../services/siblings.service';


@Component({
  selector: 'app-siblings',
  templateUrl: './siblings.component.html',
  styleUrls: ['./siblings.component.css']
})
export class SiblingsComponent implements OnDestroy {

  loading: boolean;
  selectedResource: string;
  selectedUid: string;
  selectedDisplayName: string;
  siblings: Array<any>;
  errorMsg: string;
  // This will contain key value pairs, where each key is a column and each value
  // is a boolean determining if the column should be shown
  columns: any;
  // This number is displayed on the screen and a map function can't be run in the
  // Angular template, so we must manually maintain it. Alternatively, we could make
  // this a function, but then it'd get run on every change detection cycle which isn't
  // desirable.
  numActiveColumns: number;
  // If a column is in this array, then when the column's text appears in a modal,
  // it'll be wrapped with the pre tags
  preformattedColumns = ['log_message'];
  // If a column is in this array, then it'll be displayed as a link to its
  // corresponding external system
  uidColumns = ['id', 'hash'];
  // Will contain a reference to the modal displayed as part of the openModal method
  modalRef: BsModalRef;
  private unsubscribe: Subject<any> = new Subject();

  constructor(private siblingsService: SiblingsService, private router: Router,
              private route: ActivatedRoute, private modalService: BsModalService) {
    this.loading = true;
    this.router.events.pipe(takeUntil(this.unsubscribe),
                            filter((event: Event) => event instanceof NavigationEnd)).subscribe(() => {
      // Reset the values on every route change
      this.siblings = null;
      this.columns = {};
      this.numActiveColumns = 0;

      this.selectedResource = this.route.snapshot.params['resource'];
      this.selectedUid = this.route.snapshot.params['uid'];

      let reverse: boolean;
      if ('reverse' in this.route.snapshot.queryParams) {
        reverse = this.route.snapshot.queryParams['reverse'];
      } else {
        reverse = false;
      }

      if ('displayName' in this.route.snapshot.queryParams) {
        this.selectedDisplayName = this.route.snapshot.queryParams['displayName'];
      } else {
        this.selectedDisplayName = null;
      }

      this.getSiblings(this.selectedResource, this.selectedUid, reverse);
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getSiblings(resource: string, uid: string, reverse: boolean) {
    this.loading = true;
    this.siblingsService.getSiblings(resource, uid, reverse).subscribe(
      siblings => {
        if (siblings.length) {
          const defaultColumns = this.getDefaultColumns(siblings[0].resource_type);
          for (const column of Object.keys(siblings[0])) {
            // Check to see if the column should be displayed by default
            if (defaultColumns.includes(column)) {
              this.numActiveColumns += 1;
              this.columns[column] = true;
            } else {
              // resource_type is an internal detail so avoid displaying that
              if (column !== 'resource_type') {
                this.columns[column] = false;
              }
            }
          }
        } else {
          this.errorMsg = 'There are no siblings associated with this artifact';
        }
        this.siblings = siblings;
        this.loading = false;
      },
      errorResponse => {
        this.errorMsg = errorResponse.error.message;
        this.loading = false;
      }
    );
  }

  setColumnState(columnName: string): void {
    // Triggered by when a checkbox from the dropdown menu is checked/unchecked
    if (this.columns[columnName]) {
      this.columns[columnName] = false;
      this.numActiveColumns -= 1;
    } else {
      this.columns[columnName] = true;
      this.numActiveColumns += 1;
    }
  }

  getDefaultColumns(resource: string) {
    switch (resource.toLowerCase()) {
      case ('bugzillabug'):
        return ['id', 'assignee', 'reporter', 'short_description', 'status'];
      case ('distgitcommit'):
        return ['author', 'hash', 'log_message'];
      case ('kojibuild'):
      case ('containerkojibuild'):
        return ['id', 'name', 'owner', 'release', 'version'];
      case ('containeradvisory'):
      case ('advisory'):
        return ['advisory_name', 'assigned_to', 'id', 'security_impact', 'state', 'synopsis'];
      case ('freshmakerevent'):
        return ['id', 'state_name', 'state_reason', 'triggered_container_builds'];
      default:
        return ['id'];
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
