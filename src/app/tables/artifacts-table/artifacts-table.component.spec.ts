import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';

import { ArtifactsTableComponent } from './artifacts-table.component';
import { EstuaryTableComponent } from '../table.component';
import { TruncateModalComponent } from '../truncate-modal/truncate-modal.component';
import { NodeExternalUrlPipe, TruncatePipe } from '../../pipes/nodedisplay';
import { PropertyDisplayPipe, PropertyValueDisplayPipe } from '../../pipes/propertydisplay';
import { siblings } from '../../story/test.data';


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
        EstuaryTableComponent,
        NodeExternalUrlPipe,
        PropertyDisplayPipe,
        PropertyValueDisplayPipe,
        TruncatePipe,
        TruncateModalComponent,
      ],
      providers: [DatePipe],
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        BsDropdownModule.forRoot(),
        ModalModule.forRoot(),
        ToastrModule.forRoot({}),
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
    const bzUrl = 'https://bugzilla.redhat.com/show_bug.cgi?id=';
    // Ensure the title on the page is correct
    const title = fixture.debugElement.query(By.css('.table-title')).nativeElement;
    expect(title.textContent.trim()).toBe('Bugzilla bugs resolved by commit #eacc1bf66aa53b3136ac045ead618e18a6751625');

    // Ensure the table headers show only the default columns
    const tableHeaders = fixture.debugElement.queryAll(By.css('.estuary-table th'));
    expect(tableHeaders.length).toBe(7);
    const tableHeadersText = tableHeaders.map(v => v.nativeElement.textContent.trim());
    expect(tableHeadersText[0]).toBe('Assignee');
    expect(tableHeadersText[1]).toBe('ID');
    expect(tableHeadersText[2]).toBe('Modified Time');
    expect(tableHeadersText[3]).toBe('Reporter');
    expect(tableHeadersText[4]).toBe('Short Description');
    expect(tableHeadersText[5]).toBe('Status');

    // Make sure the correct number of columns show as selected and that only 20 columns
    // are available since "Resource Type" and "Display Name" should be excluded
    const activeColumnsText = fixture.debugElement.query(By.css('.estuary-table-header__columns-text')).nativeElement;
    expect(activeColumnsText.textContent.trim()).toBe('6 of 20 columns selected');

    // Ensure the actual table content is correct. All 2 entries in the `formattedArtifacts` array
    // should be displayed.
    const rows = fixture.debugElement.queryAll(By.css('.estuary-table tbody > tr'));
    expect(rows.length).toBe(2);
    const rowOneColumns = rows[0].nativeElement.children;
    expect(rowOneColumns[0].textContent.trim()).toBe('tbrady');
    // The ID column should contain a link to Bugzilla
    let idLink = rowOneColumns[1].children[0];
    expect(idLink.tagName).toBe('A');
    expect(idLink.textContent.trim()).toBe('1566849');
    expect(idLink.href).toBe(`${bzUrl}1566849`);
    expect(rowOneColumns[2].textContent.trim()).toBe('June 19, 2018, 09:10:31 UTC');
    expect(rowOneColumns[3].textContent.trim()).toBe('user1');
    expect(rowOneColumns[4].textContent.trim()).toBe('CVE-2018-1234 kernel: some error [rhel-7.5.z]');
    expect(rowOneColumns[5].textContent.trim()).toBe('CLOSED');
    expect(rowOneColumns[6].textContent.trim()).toBe('See Story');
    expect(rowOneColumns[6].children[0].href).toContain('/bugzillabug/1566849');

    const rowTwoColumns = rows[1].nativeElement.children;
    expect(rowTwoColumns[0].textContent.trim()).toBe('user2');
    // The ID column should contain a link to Bugzilla
    expect(rowTwoColumns[1].children[0].tagName).toBe('A');
    expect(rowTwoColumns[1].children[0].textContent.trim()).toBe('1567084');
    idLink = rowTwoColumns[1].children[0];
    expect(idLink.tagName).toBe('A');
    expect(idLink.textContent.trim()).toBe('1567084');
    expect(idLink.href).toBe(`${bzUrl}1567084`);
    expect(rowTwoColumns[2].textContent.trim()).toBe('June 19, 2018, 07:34:08 UTC');
    expect(rowTwoColumns[3].textContent.trim()).toBe('user2');
    // The "Short Description" column is too long, so it becomes a link to a modal
    expect(rowTwoColumns[4].textContent.trim()).toBe('CVE-2018-1235 kernel: some really long error that …');
    expect(rowTwoColumns[4].firstElementChild.tagName).toBe('APP-TRUNCATE-MODAL');
    expect(rowTwoColumns[5].textContent.trim()).toBe('CLOSED');
    expect(rowTwoColumns[6].textContent.trim()).toBe('See Story');
    expect(rowTwoColumns[6].children[0].href).toContain('/bugzillabug/1567084');

    // Click the dropdown button so that the menu appears
    const dropdownButton = fixture.debugElement.query(
      By.css('.estuary-table-header__dropdown-button')).nativeElement;
    dropdownButton.click();
    // Tick one second for the dropdown list to appear
    tick(1000);
    // Now that the dropdown list is present, Angular must detect that it needs to run ngFor
    // to populate the list
    fixture.detectChanges();

    const dropdownMenu = fixture.debugElement.query(
      By.css('.estuary-table-header__dropdown-menu')).nativeElement;
      // Expect there to be 20 columns to be able to check
      expect(dropdownMenu.children.length).toBe(20);
      const expectedActiveColumns = ['Assignee', 'ID', 'Reporter', 'Short Description',  'Status', 'Modified Time'];
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
  }));
});
