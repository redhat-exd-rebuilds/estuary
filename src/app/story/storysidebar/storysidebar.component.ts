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

  getResourceLink(): String {
    switch (this.node.resource_type.toLowerCase()) {
      case('bugzillabug'):
        return `https://bugzilla.redhat.com/show_bug.cgi?id=${this.node.id}`;
      case('distgitcommit'):
        // Currently returning the link to cgit and not the commit
        // because this will require a change in the API
        return `http://pkgs.devel.redhat.com/cgit/`;
      case('kojibuild'):
        return `https://brew.engineering.redhat.com/brew/buildinfo?buildID=${this.node.id}`;
      case('advisory'):
        return `http://errata.engineering.redhat.com/advisory/${this.node.id}`;
      case('freshmakerevent'):
        return `https://freshmaker.engineering.redhat.com/api/1/events/${this.node.id}`;
      case('containerbuilds'):
        return `https://freshmaker.engineering.redhat.com/api/1/builds/${this.node.id}`;
      default:
        return '';
    }
  }
}
