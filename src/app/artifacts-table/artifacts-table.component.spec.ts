import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastNotificationModule } from 'patternfly-ng/notification';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { NodeExternalUrlPipe, TruncatePipe } from '../pipes/nodedisplay';
import { PropertyDisplayPipe, PropertyValueDisplayPipe } from '../pipes/propertydisplay';
import { siblings } from '../story/test.data';

import { ArtifactsTableComponent } from './artifacts-table.component';

describe('ArtifactsTableComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  // Create a dummy component that just has the ArtifactsTableComponent so that way
  // we don't have to fake the ngOnChanges method
  @Component({
    selector: 'app-test-host',
    template: `<app-artifacts-table [artifacts]="artifacts" [title]="title"></app-artifacts-table>`
  })
  class TestHostComponent {
    title: string;
    artifacts: Array<any>;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestHostComponent,
        ArtifactsTableComponent,
        NodeExternalUrlPipe,
        PropertyDisplayPipe,
        PropertyValueDisplayPipe,
        TruncatePipe
      ],
      providers: [DatePipe],
      imports: [
        HttpClientTestingModule,
        ToastNotificationModule,
        NoopAnimationsModule,
        BsDropdownModule.forRoot(),
        ModalModule.forRoot()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.artifacts = siblings.data;
    component.title = siblings.meta.description;
    fixture.detectChanges();
  });

  it('should show the siblings of RHBZ#1566849', fakeAsync(() => {
    const title = fixture.debugElement.query(By.css('.title')).nativeElement;
    expect(title.textContent).toBe('Bugzilla bugs resolved by commit #eacc1bf66aa53b3136ac045ead618e18a6751625');

    const tableHeaders = fixture.debugElement.queryAll(By.css('.artifacts-table th'));
    expect(tableHeaders.length).toBe(5);
    expect(tableHeaders[0].nativeElement.textContent.trim()).toBe('Assignee');
    expect(tableHeaders[1].nativeElement.textContent.trim()).toBe('ID');
    expect(tableHeaders[2].nativeElement.textContent.trim()).toBe('Reporter');
    expect(tableHeaders[3].nativeElement.textContent.trim()).toBe('Short Description');
    expect(tableHeaders[4].nativeElement.textContent.trim()).toBe('Status');

    const activeColumnsText = fixture.debugElement.query(By.css('.artifacts-table-header__columns-text')).nativeElement;
    expect(activeColumnsText.textContent.trim()).toBe('5 of 20 columns selected');

    const rows = fixture.debugElement.queryAll(By.css('.artifacts-table tbody > tr'));
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
    // Click the dropdown button so that the menu appears
    const dropdownButton = fixture.debugElement.query(By.css('.artifacts-table-header__dropdown-button')).nativeElement;
    dropdownButton.click();
    // Tick one second for the dropdown list to appear
    tick(1000);
    // Now that the dropdown list is present, Angular must detect that it needs to run ngFor
    // to populate the list
    fixture.detectChanges();

    const dropdownMenu = fixture.debugElement.query(By.css('.artifacts-table-header__dropdown-menu')).nativeElement;
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
    let tableHeaders = fixture.debugElement.queryAll(By.css('.artifacts-table th'));
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
    tableHeaders = fixture.debugElement.queryAll(By.css('.artifacts-table th'));
    expect(tableHeaders.length).toBe(5);
    expect(tableHeaders[0].nativeElement.textContent.trim()).toBe('Classification');
    expect(tableHeaders[1].nativeElement.textContent.trim()).toBe('ID');
    expect(tableHeaders[2].nativeElement.textContent.trim()).toBe('Reporter');
    expect(tableHeaders[3].nativeElement.textContent.trim()).toBe('Short Description');
    expect(tableHeaders[4].nativeElement.textContent.trim()).toBe('Status');
  }));

  it('should show allow the siblings of RHBZ#1566849 to be exported to a CSV', fakeAsync(() => {
    // Create a spy object with a click() method to simulate the dynamically created link
    // after clicking on the "Export CSV" button
    const spyLink = jasmine.createSpyObj(['click']);
    // Spy on document.createElement() and return the fake link
    spyOn(document, 'createElement').and.returnValue(spyLink);

    const exportBtn = fixture.debugElement.query(By.css('.artifacts-table-header__export-btn'));
    exportBtn.nativeElement.click();
    // Make sure a link was created
    expect(document.createElement).toHaveBeenCalledTimes(1);
    expect(document.createElement).toHaveBeenCalledWith('a');
    // Make sure the link was generated with the CSV data
    expect(spyLink.href).toBe('data:text/csv;charset=utf-8,Assignee,ID,Reporter,Short%20Description,Status%0A%22' +
                              'tbrady%22,%221566849%22,%22user1%22,%22CVE-2018-1234%20kernel:%20some%20error%20%5B' +
                              'rhel-7.5.z%5D%22,%22CLOSED%22%0A%22user2%22,%221567084%22,%22user2%22,' +
                              '%22CVE-2018-1235%20kernel:%20some%20really%20long%20error%20that%20is%20hard%20to%20fix' +
                              '%20and%20causes%20problems%20%5Brhel-7.5.z%5D%22,%22CLOSED%22%0A');
    expect(spyLink.target).toBe('_blank');
    expect(spyLink.download).toBe('bugzilla_bugs_resolved_by_commit_#eacc1bf66aa53b3136ac045ead618e18a6751625.csv');
    // Make sure the link was clicked to trigger the download
    expect(spyLink.click).toHaveBeenCalledTimes(1);
  }));
});
