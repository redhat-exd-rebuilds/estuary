import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NodeFilterPropertiesPipe } from '../../pipes/nodedisplay';

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
      const filterProperties = new NodeFilterPropertiesPipe();
      for (const [key, val] of filterProperties.transform(this.node)) {
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
}
