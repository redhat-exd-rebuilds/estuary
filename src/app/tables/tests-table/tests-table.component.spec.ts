import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { TestsTableComponent } from './tests-table.component';
import { EstuaryTableComponent } from '../table.component';
import { TruncateModalComponent } from '../truncate-modal/truncate-modal.component';
import { GreenwaveDecision } from '../../models/greenwave.type';
import { TruncatePipe } from '../../pipes/nodedisplay';
import { TableColumnPipe } from '../../pipes/tablecolumn';
import { greenwaveDecision as greenwaveDecisionTestData } from '../../story/test.data';


describe('ArtifactsTableComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  // Create a dummy component that just has the TestsTable so that way
  // we don't have to fake the ngOnChanges method
  @Component({
    selector: 'app-test-host',
    template: `<app-tests-table
                   [greenwaveDecision]='greenwaveDecision'
                   [subjectIdentifier]='subjectIdentifier'
               ></app-tests-table>`
  })
  class TestHostComponent {
    greenwaveDecision: GreenwaveDecision;
    subjectIdentifier: string;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestHostComponent,
        TestsTableComponent,
        EstuaryTableComponent,
        TableColumnPipe,
        TruncatePipe,
        TruncateModalComponent,
      ],
      providers: [DatePipe],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot({}),
        NoopAnimationsModule,
        BsDropdownModule.forRoot(),
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.greenwaveDecision = greenwaveDecisionTestData;
      component.subjectIdentifier = 'python36-3.6-8010020190626162728.a920e634';
    fixture.detectChanges();
  });

  it('should show the test results from a Greenwave decision', fakeAsync(() => {
    const resultsDBURL = 'https://resultsdb.domain.local/api/v2.0/';
    const waiverDBURL = 'https://waiverdb.domain.local/api/v1.0/';
    const jenkinsLogURL = 'https://jenkins.domain.local/job/cvp-product-test/1/';
    // Ensure the title on the page is correct
    const title = fixture.debugElement.query(By.css('.table-title')).nativeElement;
    expect(title.textContent.trim()).toBe('Test Results for python36-3.6-8010020190626162728.a920e634');

    // Ensure the table headers show only the default columns
    const tableHeaders = fixture.debugElement.queryAll(By.css('.estuary-table th'));
    expect(tableHeaders.length).toBe(6);
    const tableHeadersText = tableHeaders.map(v => v.nativeElement.textContent.trim());
    expect(tableHeadersText[0]).toBe('ID');
    expect(tableHeadersText[1]).toBe('Impacts the Decision');
    expect(tableHeadersText[2]).toBe('Logs');
    expect(tableHeadersText[3]).toBe('Status');
    expect(tableHeadersText[4]).toBe('Test Case');
    expect(tableHeadersText[5]).toBe('Waived');

    // Make sure the correct number of columns show as selected and that only 4 columns
    // are available
    const activeColumnsText = fixture.debugElement.query(By.css('.estuary-table-header__columns-text')).nativeElement;
    expect(activeColumnsText.textContent.trim()).toBe('6 of 7 columns selected');

    // Ensure the actual table content is correct. All 2 entries in the `formattedResults` array
    // should be displayed.
    const rows = fixture.debugElement.queryAll(By.css('.estuary-table tbody > tr'));
    expect(rows.length).toBe(2);
    const rowOneColumns = rows[0].nativeElement.children;

    let idLink = rowOneColumns[0].children[0];
    expect(idLink.tagName).toBe('A');
    expect(idLink.textContent.trim()).toBe('7504231');
    expect(idLink.href).toBe(`${resultsDBURL}results/7504231`);

    expect(rowOneColumns[1].textContent.trim()).toBe('Yes');

    let logsLink = rowOneColumns[2].children[0];
    expect(logsLink.tagName).toBe('A');
    expect(logsLink.textContent.trim()).toBe('Test Run Logs');
    expect(logsLink.href).toBe(jenkinsLogURL);

    expect(rowOneColumns[3].textContent.trim()).toBe('PASSED');

    let testCaseLink = rowOneColumns[4].children[0];
    expect(testCaseLink.tagName).toBe('A');
    expect(testCaseLink.textContent.trim()).toBe('rhproduct.default.sanity');
    expect(testCaseLink.href).toBe(`${resultsDBURL}testcases/rhproduct.default.sanity`);

    const waivedLink = rowOneColumns[5].children[0];
    expect(waivedLink.textContent.trim()).toBe('Yes');
    expect(waivedLink.href).toContain('16549');

    const rowTwoColumns = rows[1].nativeElement.children;
    idLink = rowTwoColumns[0].children[0];
    expect(idLink.tagName).toBe('A');
    expect(idLink.textContent.trim()).toBe('7504236');
    expect(idLink.href).toBe(`${resultsDBURL}results/7504236`);

    expect(rowTwoColumns[1].textContent.trim()).toBe('Yes');

    logsLink = rowTwoColumns[2].children[0];
    expect(logsLink.tagName).toBe('A');
    expect(logsLink.textContent.trim()).toBe('Test Run Logs');
    expect(logsLink.href).toBe(jenkinsLogURL);

    expect(rowTwoColumns[3].textContent.trim()).toBe('FAILED');

    testCaseLink = rowTwoColumns[4].children[0];
    expect(testCaseLink.tagName).toBe('A');
    expect(testCaseLink.textContent.trim()).toBe('rhproduct.default.functional');
    expect(testCaseLink.href).toBe(`${resultsDBURL}testcases/rhproduct.default.functional`);

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
      // Expect there to be 6 columns to be able to check
      expect(dropdownMenu.children.length).toBe(7);
      const expectedActiveColumns = ['ID', 'Impacts the Decision', 'Logs', 'Status',  'Test Case', 'Waived'];
      const expectedColumns = ['ID', 'Impacts the Decision', 'Item', 'Logs', 'Status',  'Test Case', 'Waived'];
      for (let i = 0; i < expectedColumns.length; i++) {
        const columnText = dropdownMenu.children[i].textContent.trim();
        expect(dropdownMenu.children[i].textContent.trim()).toBe(expectedColumns[i]);
        const expectedChecked = expectedActiveColumns.includes(columnText);
        expect(dropdownMenu.children[i].children[0].checked).toBe(expectedChecked);
      }
  }));
});
