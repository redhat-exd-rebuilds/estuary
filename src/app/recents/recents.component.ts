import { Component, NgModule, OnInit } from '@angular/core';

import { RecentsService } from '../services/recents.service';
import { recents } from './test.data';
import { resource } from 'selenium-webdriver/http';
import { PropertyDisplayPipe, PropertyValueDisplayPipe } from '../pipes/propertydisplay';
import { TabsModule } from 'ngx-bootstrap/tabs';


@Component({
  selector: 'app-recents',
  templateUrl: './recents.component.html',
  styleUrls: ['./recents.component.css']
})
@NgModule({
  imports: [TabsModule.forRoot()]
})
export class RecentsComponent implements OnInit {

  recents: Array<any>; // filtered by tab
  recentsAll: Array<any>; // everything
  meta: Array<any>; // metadata
  types: Array<string>; // types of artifacts
  loading: boolean;
  title: String;

  constructor(private recentsService: RecentsService) {
    this.loading = true;
    this.title = 'Recent Artifacts';
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
        console.dir(recentsAll);
        this.meta = recentsAll['metadata'];
        this.types = Object.keys(this.recentsAll);
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  getRecents(type: string) {
    // Gets recent artifacts of a specified type and populates recents
    this.recents = this.recentsAll[type];
    return this.recents;
  }

}
