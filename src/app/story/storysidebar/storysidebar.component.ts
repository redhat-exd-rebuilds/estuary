import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-storysidebar',
  templateUrl: './storysidebar.component.html',
  styleUrls: ['./storysidebar.component.css']
})
export class StorysidebarComponent implements OnInit, OnChanges {
  @Input() node: any;
  sidebarOpen = false;
  properties = [];

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
    // Open the sidebar by default on larger screens
    this.sidebarOpen = window.screen.width >= 996;
  }

  ngOnChanges() {
    // this.properties will contain a list of objects, where each object will have
    // the keys: name, value, truncate (should truncate in the UI), and needsTruncating
    // (needs truncating in the UI because the text is long). These properties will be
    // displayed in the properties sidebar. This is in ngOnChanges so that we catch when
    // the node input changes.
    this.properties = [];
    if (this.node) {
      for (const [key, val] of this.filterProperties(this.node)) {
        let formattedVal = val;
        if (this.isDate(val)) {
          formattedVal = this.datePipe.transform(val, 'MMMM d, y, HH:mm:ss', '+0000') + ' UTC';
        }
        this.properties.push({
          name: key,
          value: formattedVal,
          truncate: true,
          needsTruncating: val.length > 200
        });
      }
    }
  }

  isDate(dateStr: String): Boolean {
    if (typeof dateStr === 'string') {
        const dtRegEx = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.\d+)?(?:Z|[-+]00(?::00)?)?$/;
        return dtRegEx.test(dateStr);
    }
    return false;
  }

  filterProperties(node: any): any {
    const properties = [];
    for (const keyValue of Object.entries(node)) {
        // Have to do this here instead of the for loop to make TypeScript happy
        const [key, value]: Array<any> = keyValue;
        if (value === null || key === 'resource_type') {
            continue;
        }
        // Can't use typeof to determine if it's an Array
        if (value instanceof Array) {
            properties.push([key, value.length]);
        } else if (typeof value === 'object') {
            // Only display objects' name or username properties
            if (value.name) {
                properties.push([key, value.name]);
            } else if (value.username) {
                properties.push([key, value.username]);
            }
        } else {
            properties.push([key, value]);
        }
    }
    return properties;
  }
}
