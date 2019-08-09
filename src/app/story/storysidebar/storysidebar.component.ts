import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { trigger, transition, style, animate, state } from '@angular/animations';

import { PropertyValueDisplayPipe } from '../../pipes/propertydisplay';


@Component({
  selector: 'app-storysidebar',
  templateUrl: './storysidebar.component.html',
  styleUrls: ['./storysidebar.component.css'],
  animations: [
    trigger('slideInSlideOut', [
      state('open', style({})),
      state('closed',
        style({
          width: '25px'
        }),
      ),
      transition('closed => open', animate('0.3s ease-out')),
    ])
  ]
})
export class StorysidebarComponent implements OnInit, OnChanges {
  @Input() node: any;
  sidebarOpen = false;
  // These are the formatted properties to display
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
      for (const [key, val] of this.formatProperties(this.node)) {
        const property = {
          name: key,
          truncate: true,
          value: val,
          needsTruncating: false,
          link: null
        };
        // All 0+ relationships are represented as arrays with objects inside
        if (this.node[key] instanceof Array && this.node[key].length && this.node[key][0] instanceof Object) {
          property['link'] = ['/relationship', this.node.resource_type.toLowerCase()];
          if (this.node.resource_type === 'DistGitCommit') {
            property['link'].push(this.node.hash);
          } else {
            property['link'].push(this.node.id);
          }
          property['link'].push(key);
        } else {
          property['needsTruncating'] = val.length > 200;
        }
        this.properties.push(property);
      }
    }
  }

  formatProperties(node: any): any {
    const properties = [];
    const propertyValueDisplayPipe = new PropertyValueDisplayPipe(this.datePipe);
    for (const keyValue of Object.entries(node)) {
        // Have to do this here instead of the for loop to make TypeScript happy
        const [key, value]: Array<any> = keyValue;
        if (value === null || key === 'resource_type' || key === 'display_name') {
          continue;
        } else {
          const displayValue = propertyValueDisplayPipe.transform(value);
          // If the pipe doesn't know how to convert the value to a display value, it returns null
          if (displayValue !== null) {
            properties.push([key, displayValue]);
          }
        }
    }
    return properties;
  }
}
