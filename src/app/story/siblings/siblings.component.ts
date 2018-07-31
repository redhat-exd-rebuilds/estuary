import { Component, OnDestroy, TemplateRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { SiblingsService } from '../../services/siblings.service';
import { PropertyValueDisplayPipe } from '../../pipes/propertydisplay';
import { DatePipe } from '@angular/common';


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
  // Keeps track of which column to sort by
  sortedBy: string;
  // Will contain a reference to the modal displayed as part of the openModal method
  modalRef: BsModalRef;
  private unsubscribe: Subject<any> = new Subject();

  constructor(private siblingsService: SiblingsService, private router: Router,
              private route: ActivatedRoute, private modalService: BsModalService,
              private datePipe: DatePipe) {
    this.loading = true;
    this.router.events.pipe(takeUntil(this.unsubscribe),
                            filter((event: Event) => event instanceof NavigationEnd)).subscribe(() => {
      // Reset the values on every route change
      this.siblings = [];
      this.columns = {};
      this.numActiveColumns = 0;
      this.sortedBy = null;
      this.selectedDisplayName = null;

      this.selectedResource = this.route.snapshot.params['resource'];
      this.selectedUid = this.route.snapshot.params['uid'];

      let backwardRel: boolean;
      if ('backward_rel' in this.route.snapshot.queryParams) {
        backwardRel = this.route.snapshot.queryParams['backward_rel'];
      } else {
        backwardRel = false;
      }

      this.getSiblings(this.selectedResource, this.selectedUid, backwardRel);
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getSiblings(resource: string, uid: string, backwardRel: boolean) {
    this.loading = true;
    this.siblingsService.getSiblings(resource, uid, backwardRel).subscribe(
      siblings => {
        if (siblings.data.length) {
          this.selectedDisplayName = siblings.meta.description;
          this.siblings = [];
          this.columns = {};
          let sortedBy: string;
          const defaultColumns = this.getDefaultColumns(siblings.data[0].resource_type);
          for (const column of Object.keys(siblings.data[0])) {
            // resource_type is an internal detail so avoid displaying that
            if (column === 'resource_type' || column === 'display_name') {
              continue;
            }

            // Check to see if the column should be displayed by default
            if (defaultColumns.includes(column)) {
              this.numActiveColumns += 1;
              this.columns[column] = true;
            } else {
              this.columns[column] = false;
            }

            if (sortedBy === undefined && this.uidColumns.includes(column)) {
              // Default to sorting by the unique identifier
              sortedBy = column;
            }
          }

          // Format the property values now instead of in the template for efficiency
          // and to also allow sorting using only strings
          const propValDisplayPipe = new PropertyValueDisplayPipe(this.datePipe);
          for (const sibling of siblings.data) {
            const formattedSibling = {};
            for (const [key, value] of Object.entries(sibling)) {
              formattedSibling[key] = propValDisplayPipe.transform(value);
            }
            this.siblings.push(formattedSibling);
          }

          if (sortedBy) {
            // Sort the results by the UID column
            this.sortSiblings(sortedBy);
          }
        } else {
          this.errorMsg = 'There are no siblings associated with this artifact';
        }
        this.loading = false;
      },
      errorResponse => {
        this.errorMsg = errorResponse.error.message;
        this.loading = false;
      }
    );
  }

  sortSiblings(columnName: string): void {
    let ascending = false;
    if (columnName === this.sortedBy) {
      ascending = true;
    }

    let sortOrder = 1;
    if (ascending) {
      sortOrder = -1;
    }

    // This function was inspired from:
    // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
    function dynamicSort (a, b) {
      let aValue = a[columnName];
      let bValue = b[columnName];
      if (columnName.endsWith('time') || columnName.endsWith('date')) {
        // If the values are dates then sort using dates instead of strings
        aValue = Date.parse(aValue);
        bValue = Date.parse(bValue);
      }
      const result = (aValue < bValue) ? -1 : (aValue > bValue) ? 1 : 0;
      return result * sortOrder;
    }

    this.siblings.sort(dynamicSort);
    if (ascending) {
      this.sortedBy = '-' + columnName;
    } else {
      this.sortedBy = columnName;
    }
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
