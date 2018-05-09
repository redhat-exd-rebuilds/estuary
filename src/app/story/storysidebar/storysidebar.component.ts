import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-storysidebar',
  templateUrl: './storysidebar.component.html',
  styleUrls: ['./storysidebar.component.css']
})
export class StorysidebarComponent implements OnInit {
  @Input() node: any;
  sidebarOpen = false;

  constructor() { }

  ngOnInit() {
    // Open the sidebar by default on larger screens
    this.sidebarOpen = window.screen.width >= 996;
  }

  isDate(dateStr: String): Boolean {
    if (typeof dateStr === 'string') {
        const dtRegEx = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.\d+)?(?:Z|[-+]00(?::00)?)?$/;
        return dtRegEx.test(dateStr);
    }
    return false;
  }
}
