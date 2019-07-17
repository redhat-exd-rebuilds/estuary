import { fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { of } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { RecentsComponent } from './recents.component';
import { RecentsService } from '../services/recents.service';
import { recents } from './test.data';
import { NodeTypeDisplayPipe, NodeExternalUrlPipe, TruncatePipe } from '../pipes/nodedisplay';
import { ArtifactsTableComponent } from '../tables/artifacts-table/artifacts-table.component';
import { EstuaryTableComponent } from '../tables/table.component';
import { PropertyDisplayPipe, PropertyValueDisplayPipe } from '../pipes/propertydisplay';


describe('RecentsComponent', () => {
  let fixture: ComponentFixture<RecentsComponent>;
  let recentsService: RecentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ArtifactsTableComponent,
        EstuaryTableComponent,
        NodeTypeDisplayPipe,
        NodeExternalUrlPipe,
        PropertyDisplayPipe,
        PropertyValueDisplayPipe,
        RecentsComponent,
        TruncatePipe
      ],
      providers: [
        RecentsService,
        DatePipe
      ],
      imports: [
        TabsModule.forRoot(),
        HttpClientTestingModule,
        NoopAnimationsModule,
        BsDropdownModule.forRoot()
      ],
      // This is used to avoid having to import components we don't test here
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    recentsService = TestBed.get(RecentsService);
  });

  it('should retrieve the 5 most recent advisories', fakeAsync(() => {
    spyOn(recentsService, 'getRecents').and.returnValue(
      of(recents)
    );
    fixture = TestBed.createComponent(RecentsComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component.recentsAll).toBe(recents.data);
    expect(component.meta).toBe(recents.metadata);
    expect(component.types).toEqual(Object.keys(recents.data));
    const tabs = fixture.debugElement.queryAll(By.css('tab'));
    expect(tabs.length).toBe(5);

    // Ensure the tab headings are correct
    const expectedTabs = ['Advisory', 'Commit', 'Freshmaker Event', 'Build', 'Bugzilla Bug'];
    expectedTabs.forEach((header, index) => {
      expect(tabs[index].nativeElement.getAttribute('ng-reflect-heading')).toBe(header);
    });

    // Ensure that table headers are correct
    let tableHeaders = fixture.debugElement.queryAll(By.css('th'));
    const expectedHeaders = ['Advisory Name', 'ID', 'Security Impact', 'State', 'Synopsis', 'Update Date'];
    expectedHeaders.forEach((header, index) => {
      expect(tableHeaders[index].nativeElement.textContent.trim()).toBe(header);
    });

    // Ensure the correct content is being displayed after clicking a new tab
    const tabLinks = fixture.debugElement.queryAll(By.css('.nav-link'));
    tabLinks[1].nativeElement.click();
    tick(1000);
    fixture.detectChanges();
    const activeTab = fixture.debugElement.query(By.css('.nav-item .active'));
    expect(activeTab.nativeElement.textContent).toBe('Commit');
    tableHeaders = fixture.debugElement.queryAll(By.css('.active > app-artifacts-table th'));
    expect(tableHeaders[0].nativeElement.textContent.trim()).toBe('Commit Date');
    expect(tableHeaders[1].nativeElement.textContent.trim()).toBe('Hash');
    expect(tableHeaders[2].nativeElement.textContent.trim()).toBe('Log Message');

  }));
});
