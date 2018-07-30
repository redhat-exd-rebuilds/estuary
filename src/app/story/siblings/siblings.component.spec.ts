import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { ToastNotificationModule } from 'patternfly-ng/notification';

import { SiblingsComponent } from './siblings.component';
import { SiblingsService } from '../../services/siblings.service';
import { NodeExternalUrlPipe, TruncatePipe } from '../../pipes/nodedisplay';
import { PropertyDisplayPipe, PropertyValueDisplayPipe } from '../../pipes/propertydisplay';
import { KeysPipe } from '../../pipes/general.pipe';
import { siblings } from '../test.data';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DatePipe } from '@angular/common';


const url = 'http://localhost:4200/siblings/distgitcommit/eacc1bf66aa53b3136ac045ead618e18a6751625?last=false';
class MockRouter {
  public events = of(new NavigationEnd(0, url, url));
}


describe('SiblingsComponent', () => {
  let fixture: ComponentFixture<SiblingsComponent>;
  let siblingsService: SiblingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SiblingsComponent,
        NodeExternalUrlPipe,
        PropertyDisplayPipe,
        PropertyValueDisplayPipe,
        KeysPipe,
        TruncatePipe
      ],
      providers: [
        SiblingsService,
        {provide: Router, useClass: MockRouter},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                'resource': 'distgitcommit',
                'uid': 'eacc1bf66aa53b3136ac045ead618e18a6751625'
              },
              queryParams: {}
            }
          }
        },
        DatePipe
      ],
      imports: [
        HttpClientTestingModule,
        ToastNotificationModule,
        NoopAnimationsModule,
        BsDropdownModule.forRoot(),
        ModalModule.forRoot()
      ],
      // This is used to avoid having to import components we don't test here
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    siblingsService = TestBed.get(SiblingsService);
  });

  it('should show the siblings of RHBZ#1566849', fakeAsync(() => {
    spyOn(siblingsService, 'getSiblings').and.returnValue(
      // Create an observable like the HTTP client would return
      of(siblings)
    );
    // The component must be created after the spy on the SiblingsService because
    // the SiblingsService is used as part of the constructor
    fixture = TestBed.createComponent(SiblingsComponent);
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('.title')).nativeElement;
    expect(title.textContent).toBe('Bugzilla bugs resolved by commit #eacc1bf66aa53b3136ac045ead618e18a6751625');

    const tableHeaders = fixture.debugElement.queryAll(By.css('.siblings-table th'));
    expect(tableHeaders.length).toBe(5);
    expect(tableHeaders[0].nativeElement.textContent.trim()).toBe('Assignee');
    expect(tableHeaders[1].nativeElement.textContent.trim()).toBe('ID');
    expect(tableHeaders[2].nativeElement.textContent.trim()).toBe('Reporter');
    expect(tableHeaders[3].nativeElement.textContent.trim()).toBe('Short Description');
    expect(tableHeaders[4].nativeElement.textContent.trim()).toBe('Status');

    const activeColumnsText = fixture.debugElement.query(By.css('.siblings-table-header__columns-text')).nativeElement;
    expect(activeColumnsText.textContent.trim()).toBe('5 of 20 columns selected');

    const rows = fixture.debugElement.queryAll(By.css('.siblings-table tbody > tr'));
    expect(rows.length).toBe(2);
    const rowOneColumns = rows[0].nativeElement.children;
    expect(rowOneColumns[0].textContent.trim()).toBe('tbrady');
    // The ID column should contain a link to Bugzilla
    expect(rowOneColumns[1].children[0].tagName).toBe('A');
    expect(rowOneColumns[1].children[0].textContent.trim()).toBe('1566849');
    expect(rowOneColumns[2].textContent.trim()).toBe('user1');
    expect(rowOneColumns[3].textContent.trim()).toBe('CVE-2018-1234 kernel: some error [rhel-7.5.z]');
    expect(rowOneColumns[4].textContent.trim()).toBe('CLOSED');

    const rowTwoColumns = rows[1].nativeElement.children;
    expect(rowTwoColumns[0].textContent.trim()).toBe('user2');
    // The ID column should contain a link to Bugzilla
    expect(rowTwoColumns[1].children[0].tagName).toBe('A');
    expect(rowTwoColumns[1].children[0].textContent.trim()).toBe('1567084');
    expect(rowTwoColumns[2].textContent.trim()).toBe('user2');
    // The "Short Description" column is too long, so it gets truncated and becomes a link
    // that activates a modal
    expect(rowTwoColumns[3].textContent.trim()).toBe('CVE-2018-1235 kernel: some really long error that …');
    const shortDescriptionModalLink = rowTwoColumns[3].children[0];
    expect(shortDescriptionModalLink.tagName).toBe('A');
    expect(shortDescriptionModalLink.classList).toContain('modal-link');
    expect(rowTwoColumns[4].textContent.trim()).toBe('CLOSED');

    // Click the modal and check to make sure it displays
    shortDescriptionModalLink.click();
    // Tick one second for the modal to appear
    tick(1000);
    // We must use document.querySelector instead of using the fixture because
    // ngx-bootstrap displays the modal outside of the component
    const modalHeaderEl = document.querySelector('.modal-title');
    expect(modalHeaderEl.textContent.trim()).toBe('Short Description');
    const modalBodyEl = document.querySelector('.modal-body');
    expect(modalBodyEl.textContent.trim()).toBe(
      'CVE-2018-1235 kernel: some really long error that is hard to fix and causes problems [rhel-7.5.z]');
  }));

  it('should allow columns to be selected when showing the siblings for RHBZ#1566849', fakeAsync(() => {
    spyOn(siblingsService, 'getSiblings').and.returnValue(
      // Create an observable like the HTTP client would return
      of(siblings)
    );
    // The component must be created after the spy on the SiblingsService because
    // the SiblingsService is used as part of the constructor
    fixture = TestBed.createComponent(SiblingsComponent);
    fixture.detectChanges();

    // Click the dropdown button so that the menu appears
    const dropdownButton = fixture.debugElement.query(By.css('.siblings-table-header__dropdown-button')).nativeElement;
    dropdownButton.click();
    // Tick one second for the dropdown list to appear
    tick(1000);
    // Now that the dropdown list is present, Angular must detect that it needs to run ngFor
    // to populate the list
    fixture.detectChanges();

    const dropdownMenu = fixture.debugElement.query(By.css('.siblings-table-header__dropdown-menu')).nativeElement;
    // Expect there to be 22 columns to be able to check
    expect(dropdownMenu.children.length).toBe(20);
    const expectedActiveColumns = ['Assignee', 'ID', 'Reporter', 'Short Description',	'Status'];
    const expectedColumns = [
      'Assignee', 'Attached Advisories', 'Classification', 'Creation Time', 'ID',
      'Modified Time', 'Priority', 'Product Name', 'Product Version', 'QA Contact',
      'Related By Commits', 'Reporter', 'Resolution', 'Resolved By Commits',
      'Reverted By Commits', 'Severity', 'Short Description', 'Status',
      'Target Milestone', 'Votes'
    ];
    for (let i = 0; i < expectedColumns.length; i++) {
      const columnText = dropdownMenu.children[i].textContent.trim();
      expect(dropdownMenu.children[i].textContent.trim()).toBe(expectedColumns[i]);
      const expectedChecked = expectedActiveColumns.includes(columnText);
      expect(dropdownMenu.children[i].children[0].checked).toBe(expectedChecked);
    }

    // Check a non-default column and see if it gets displayed
    dropdownMenu.children[2].children[0].click();
    // Have Angular reflect the changes
    fixture.detectChanges();
    // Check to make sure the columns are right
    let tableHeaders = fixture.debugElement.queryAll(By.css('.siblings-table th'));
    expect(tableHeaders.length).toBe(6);
    expect(tableHeaders[0].nativeElement.textContent.trim()).toBe('Assignee');
    expect(tableHeaders[1].nativeElement.textContent.trim()).toBe('Classification');
    expect(tableHeaders[2].nativeElement.textContent.trim()).toBe('ID');
    expect(tableHeaders[3].nativeElement.textContent.trim()).toBe('Reporter');
    expect(tableHeaders[4].nativeElement.textContent.trim()).toBe('Short Description');
    expect(tableHeaders[5].nativeElement.textContent.trim()).toBe('Status');

    // Now uncheck ac olumn to make sure it dissapears
    dropdownMenu.children[0].children[0].click();
    // Have Angular reflect the changes
    fixture.detectChanges();
    // Check to make sure the columns are right
    tableHeaders = fixture.debugElement.queryAll(By.css('.siblings-table th'));
    expect(tableHeaders.length).toBe(5);
    expect(tableHeaders[0].nativeElement.textContent.trim()).toBe('Classification');
    expect(tableHeaders[1].nativeElement.textContent.trim()).toBe('ID');
    expect(tableHeaders[2].nativeElement.textContent.trim()).toBe('Reporter');
    expect(tableHeaders[3].nativeElement.textContent.trim()).toBe('Short Description');
    expect(tableHeaders[4].nativeElement.textContent.trim()).toBe('Status');
  }));

  it('should allow columns to be sorted when showing the siblings for RHBZ#1566849', fakeAsync(() => {
    spyOn(siblingsService, 'getSiblings').and.returnValue(
      // Create an observable like the HTTP client would return
      of(siblings)
    );
    // The component must be created after the spy on the SiblingsService because
    // the SiblingsService is used as part of the constructor
    fixture = TestBed.createComponent(SiblingsComponent);
    fixture.detectChanges();

    let rows = fixture.debugElement.queryAll(By.css('.siblings-table tbody > tr'));
    // Make sure the rows are sorted by ID by default
    expect(rows[0].nativeElement.children[1].children[0].textContent.trim()).toBe('1566849');
    expect(rows[1].nativeElement.children[1].children[0].textContent.trim()).toBe('1567084');

    const tableHeaders = fixture.debugElement.queryAll(By.css('.siblings-table th'));
    // Click on the ID th to make sure the order is reversed
    tableHeaders[1].nativeElement.click();
    fixture.detectChanges();
    rows = fixture.debugElement.queryAll(By.css('.siblings-table tbody > tr'));
    expect(rows[0].nativeElement.children[1].children[0].textContent.trim()).toBe('1567084');
    expect(rows[1].nativeElement.children[1].children[0].textContent.trim()).toBe('1566849');

    // Click on the Reporter th to make sure the order is set
    tableHeaders[2].nativeElement.click();
    fixture.detectChanges();
    rows = fixture.debugElement.queryAll(By.css('.siblings-table tbody > tr'));
    expect(rows[0].nativeElement.children[2].textContent.trim()).toBe('user1');
    expect(rows[1].nativeElement.children[2].textContent.trim()).toBe('user2');

    // Click on the Reporter th to make sure the order is reversed
    tableHeaders[2].nativeElement.click();
    fixture.detectChanges();
    rows = fixture.debugElement.queryAll(By.css('.siblings-table tbody > tr'));
    expect(rows[0].nativeElement.children[2].textContent.trim()).toBe('user2');
    expect(rows[1].nativeElement.children[2].textContent.trim()).toBe('user1');
  }));
});
