import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { PropertyValueDisplayPipe } from '../../pipes/propertydisplay';


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
        this.properties.push({
          name: key,
          value: val,
          truncate: true,
          needsTruncating: val.length > 200
        });
      }
    }
  }

  filterProperties(node: any): any {
    const properties = [];
    const propertyValueDisplayPipe = new PropertyValueDisplayPipe(this.datePipe);
    for (const keyValue of Object.entries(node)) {
        // Have to do this here instead of the for loop to make TypeScript happy
        const [key, value]: Array<any> = keyValue;
        if (value === null || key === 'resource_type') {
          continue;
        } else {
          const displayValue = propertyValueDisplayPipe.transform(value);
          // If the pipe doesn't know how to convert the value to a display value, it returns null
          if (displayValue !== null) {
            properties.push([key, propertyValueDisplayPipe.transform(value)]);
          }
        }
    }
    return properties;
  }
}
