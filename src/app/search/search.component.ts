import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { SearchService } from '../services/search.service';
import { Router } from '@angular/router';

import { NodeTypeDisplayPipe } from '../pipes/nodedisplay';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  availableResources: Array<any>;
  selectedResource: String;
  selectedUID: String;
  errorMsg: String;

  constructor(private search: SearchService, private router: Router) {
    // Set the the background image
    document.body.className = 'searchBg';
  }

  ngOnInit() {
    this.search.getAvailableResources().subscribe(
      resources => {
        const nodeTypeDisplayPipe = new NodeTypeDisplayPipe();
        this.availableResources = [];
        for (const resource of Object.keys(resources)) {
          this.availableResources.push({
            'name': resource,
            'displayName': nodeTypeDisplayPipe.transform(resource)
          });
        }
        this.availableResources.sort((a, b) => {
          if (a.displayName < b.displayName) {
            return -1;
          } else if (a.displayName > b.displayName) {
            return 1;
          } else {
            return 0;
          }
        });
        // Default the select element to be the first key
        this.selectedResource = Object.keys(resources)[0];
      },
      errorResponse => {
        this.errorMsg = errorResponse.error.message;
      }
    );
  }

  ngOnDestroy() {
    // Remove the background image
    document.body.className = '';
  }

  navigateToStory() {
    if (this.selectedResource && this.selectedUID) {
      this.router.navigate(['/', this.selectedResource, this.selectedUID.trim()]);
    } else {
      this.errorMsg = 'Please enter a search value';
    }
  }
}
