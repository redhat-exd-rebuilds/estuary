import { Component, OnChanges, Input, Output, TemplateRef, SimpleChanges, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { PropertyDisplayPipe, PropertyValueDisplayPipe } from '../pipes/propertydisplay';


@Component({
  selector: 'app-artifacts-table',
  templateUrl: './artifacts-table.component.html',
  styleUrls: ['./artifacts-table.component.css']
})
export class ArtifactsTableComponent implements OnChanges {

  @Input() artifacts: Array<any>;
  @Input() title: string;
  @Output() error = new EventEmitter<string>();
  formattedArtifacts: Array<any>;
  // This will contain key value pairs, where each key is a column and each value
  // is a boolean determining if the column should be shown
  columns: any;
  // Cache the number of columns that can be displayed rather than add load to
  // Angular's change detection cycle
  numColumns: number;
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

  constructor(private modalService: BsModalService, private datePipe: DatePipe) {
    this.formattedArtifacts = [];
    this.columns = {};
    this.numColumns = 0;
    this.numActiveColumns = 0;
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName of Object.keys(changes)) {
      if (propName === 'artifacts') {
        // Only call this if the artifacts array changes since this is an expensive
        // function call
        this.formatArtifacts();
      }
    }
  }

  formatArtifacts(): void {
    this.formattedArtifacts = [];
    this.columns = {};
    this.numActiveColumns = 0;
    if (!this.artifacts || this.artifacts.length === 0) {
      return;
    }

    let sortedBy: string;
    const defaultColumns = this.getDefaultColumns(this.artifacts[0].resource_type);
    for (const column of Object.keys(this.artifacts[0])) {
      // resource_type is an internal detail so avoid displaying that
      if (column === 'resource_type' || column === 'display_name') {
        continue;
      }

      this.numColumns += 1;
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
    for (const artifact of this.artifacts) {
      const formattedArtifact = {};
      for (const [key, value] of Object.entries(artifact)) {
        formattedArtifact[key] = propValDisplayPipe.transform(value);
      }
      this.formattedArtifacts.push(formattedArtifact);
    }

    if (sortedBy) {
      // Sort the results by the UID column
      this.sortTable(sortedBy);
    }
  }

  sortTable(columnName: string): void {
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

    this.formattedArtifacts.sort(dynamicSort);
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
      case ('modulekojibuild'):
        return ['id', 'name', 'owner', 'release', 'version'];
      case ('containeradvisory'):
      case ('advisory'):
        return ['advisory_name', 'assigned_to', 'id', 'security_impact', 'state', 'synopsis'];
      case ('freshmakerevent'):
        return ['id', 'state_name', 'state_reason', 'triggered_container_builds'];
      case ('distgitrepo'):
        return ['commits', 'name', 'namespace'];
      case ('distgitbranch'):
        return ['repos', 'repo_name', 'repo_namespace'];
      case ('kojitag'):
        return ['builds', 'id', 'name'];
      default:
        return ['id'];
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  exportToCsv(): void {
    const activeColumns: Array<string> = [];
    for (const [column, active] of Object.entries(this.columns)) {
      if (active) {
        activeColumns.push(column);
      }
    }

    if (activeColumns.length === 0) {
      this.error.emit('There are no columns selected. Please select at least one columnn and try again.');
      return;
    }

    let csvContent = '';
    const propertyDisplayPipe = new PropertyDisplayPipe();
    // Add the column headers
    for (let i = 0; i < activeColumns.length; i++) {
      csvContent += propertyDisplayPipe.transform(activeColumns[i]);
      if (i === activeColumns.length - 1) {
        csvContent += '\n';
      } else {
        csvContent += ',';
      }
    }

    // Add the actual content
    for (const artifact of this.formattedArtifacts) {
      for (let i = 0; i < activeColumns.length; i++) {
        if (typeof artifact[activeColumns[i]] === 'string') {
          // Surround the column content by double quotes but if there are double quotes that appear
          // in the column, replace them with two double quotes as that is the proper way
          // to escape them
          csvContent += '"' + artifact[activeColumns[i]].replace(/"/g, '""') + '"';
        } else {
          csvContent += artifact[activeColumns[i]];
        }
        if (i !== activeColumns.length - 1) {
          csvContent += ',';
        } else {
          csvContent += '\n';
        }
      }
    }

    // Create a link with the CSV content and simulate the user clicking on it to
    // trigger a download
    const tempLink = document.createElement('a');
    tempLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
    tempLink.target = '_blank';
    tempLink.download = this.title.toLowerCase().replace(/ /g, '_') + '.csv';
    tempLink.click();
  }
}
