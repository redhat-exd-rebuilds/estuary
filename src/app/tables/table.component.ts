import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class EstuaryTableComponent implements OnChanges {

  // The title describing the table
  @Input() title: string;
  // The array of objects to display in the table
  @Input() items: Array<any>;
  // The columns to show by default when the component is first displayed
  @Input() defaultColumns: Array<string>;
  // Sort by this column by default
  @Input() defaultSortedColumn: string;
  // The column that is the unique identifier for the item to determine which
  // links apply to an item in linkColumnMappings
  @Input() uidColumn: string;
  // A mapping of the item UID to an object with the keys as column names and values
  // as the corresponding link. For example:
  // {
  //   734506: {
  //     ID: 'https://koji.domain.local/koji/buildinfo?buildID=734506'
  //   }
  //   ...
  // }
  @Input() linkColumnMappings: any;
  // All columns that should be wrapped in "pre" tags when they are shown in
  // a modal when the initial value is truncated
  @Input() preformattedColumns: Array<string>;
  @Output() error = new EventEmitter<string>();

  // This will contain key value pairs, where each key is a column and each value
  // is a boolean determining if the column should be shown
  columns: any;
  // Cache the number of columns that can be displayed rather than dynamically determine
  // this value as part of every Angular change detection cycle
  numColumns: number;
  // This number is displayed on the screen and a map function can't be run in the
  // Angular template, so we must manually maintain it. Alternatively, we could make
  // this a function, but then it'd get run on every change detection cycle which isn't
  // desirable.
  numActiveColumns: number;
  // Keeps track of which column to sort by
  sortedBy: string;

  constructor() { }

  ngOnChanges() {
    this.processItems();
  }

  processItems(): void {
    this.columns = {};
    this.numColumns = 0;
    this.numActiveColumns = 0;
    if (!this.items || this.items.length === 0) {
      return;
    }

    for (const column of Object.keys(this.items[0])) {
      this.numColumns += 1;
      // Check to see if the column should be displayed by default. If defaultColumns
      // isn't provided, then just display them all by default.
      if (!this.defaultColumns || this.defaultColumns.includes(column)) {
        this.numActiveColumns += 1;
        this.columns[column] = true;
      } else {
        this.columns[column] = false;
      }
    }

    if (this.defaultSortedColumn) {
      this.sortTable(this.defaultSortedColumn);
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
      if (columnName.endsWith('Time') || columnName.endsWith('Date')) {
        // If the values are dates then sort using dates instead of strings
        aValue = Date.parse(aValue);
        bValue = Date.parse(bValue);
      }
      const result = (aValue < bValue) ? -1 : (aValue > bValue) ? 1 : 0;
      return result * sortOrder;
    }

    this.items.sort(dynamicSort);
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

    // Add the column headers
    let csvContent = activeColumns.join() + '\n';

    // Add the actual content
    for (const item of this.items) {
      for (let i = 0; i < activeColumns.length; i++) {
        if (typeof item[activeColumns[i]] === 'string') {
          // Surround the column content by double quotes but if there are double quotes that appear
          // in the column, replace them with two double quotes as that is the proper way
          // to escape them
          csvContent += '"' + item[activeColumns[i]].replace(/"/g, '""') + '"';
        } else {
          csvContent += item[activeColumns[i]];
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
