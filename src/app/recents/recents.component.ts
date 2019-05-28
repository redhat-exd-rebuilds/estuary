import { Component, OnInit } from '@angular/core';

import { RecentsService } from '../services/recents.service';
import { recents } from './test.data';

@Component({
  selector: 'app-recents',
  templateUrl: './recents.component.html',
  styleUrls: ['./recents.component.css']
})
export class RecentsComponent implements OnInit {

  recents: Array<any>; // filtered by tab
  recentsAll: Array<any>; // everything
  meta: Array<any>; // metadata
  types: Array<string>; // types of artifacts
  loading: boolean;

  constructor(private recentsService: RecentsService) {
    console.log('heree');
    this.loading = true;
  }

  ngOnInit() {
    this.getRecentsAll();
  }

  getRecentsAll() {
    // Gets recent artifacts of all types and populates recentsAll
    console.log('boop');
    this.recentsService.getRecents().subscribe(
      recentsAll => {
        this.recentsAll = recentsAll['data'];
        console.dir(recentsAll);
        this.meta = recentsAll['metadata'];
        this.types = Object.keys(recentsAll);
        this.loading = false;
      },
      () => {
        this.loading = false;
        console.log(this.recentsAll);
      }
    );
    console.log('here');
  }

  getRecents(type: string) {
    // Gets recent artifacts of a specified type and populates recents
    this.recents = this.recentsAll['data'][type];
  }

}
