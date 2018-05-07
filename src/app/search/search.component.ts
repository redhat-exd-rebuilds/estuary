import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SearchService } from '../services/search.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  availableResources: Array<any>;
  selectedResource: String;
  selectedUID: String;

  constructor(private search: SearchService, private router: Router) { }

  ngOnInit() {
    this.search.getAvailableResources().subscribe(
      resources => {
        // Default the select element to be the first key
        this.selectedResource = Object.keys(resources)[0];
        this.availableResources = resources;
      },
      error => {
        // TODO: Change this to an alert
        console.error(error);
      }
    );
  }

  navigateToStory() {
    this.router.navigate(['/', this.selectedResource, this.selectedUID]);
  }
}
