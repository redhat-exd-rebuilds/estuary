import { Component, OnInit } from '@angular/core';

import { RecentsService } from '../services/recents.service';


@Component({
  selector: 'app-recents',
  templateUrl: './recents.component.html',
  styleUrls: ['./recents.component.css']
})
export class RecentsComponent implements OnInit {

  recentsAll: any; // all recents of every type
  meta: any;
  types: Array<string>; // types of artifacts
  loading: boolean;
  csvFileName = 'recent_artifacts';

  constructor(private recentsService: RecentsService) {
    this.loading = true;
    this.types = [];
  }

  ngOnInit() {
    this.getRecentsAll();
  }

  getRecentsAll() {
    // Gets recent artifacts of all types and populates recentsAll
    this.recentsService.getRecents().subscribe(
      recentsAll => {
        this.recentsAll = recentsAll['data'];
        this.meta = recentsAll['metadata'];
        this.types = Object.keys(this.recentsAll);
      },
      null,
      () => {
        this.loading = false;
      }
    );
  }

}
