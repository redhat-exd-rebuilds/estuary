import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastNotificationModule } from 'patternfly-ng/notification';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { TestsTableComponent } from './tests-table.component';
import { EstuaryTableComponent } from '../table.component';
import { TruncateModalComponent } from '../truncate-modal/truncate-modal.component';
import { GreenwaveDecision } from '../../models/greenwave.type';
import { TruncatePipe } from '../../pipes/nodedisplay';
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
        TruncatePipe,
        TruncateModalComponent,
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
    component.greenwaveDecision = greenwaveDecisionTestData;
      component.subjectIdentifier = 'cfme-openshift-app-ui-container-5.9.3.4-1.1533127933';
    fixture.detectChanges();
  });

  it('should show the test results from a Greenwave decision', fakeAsync(() => {
    const resultsDBURL = 'https://resultsdb.domain.local/api/v2.0/';
    const jenkinsLogURL = 'https://jenkins.domain.local/job/cvp-product-test/1/console';
    // Ensure the title on the page is correct
    const title = fixture.debugElement.query(By.css('.title')).nativeElement;
    expect(title.textContent.trim()).toBe('Test Results for cfme-openshift-app-ui-container-5.9.3.4-1.1533127933');

    // Ensure the table headers show only the default columns
    const tableHeaders = fixture.debugElement.queryAll(By.css('.estuary-table th'));
    expect(tableHeaders.length).toBe(5);
    const tableHeadersText = tableHeaders.map(v => v.nativeElement.textContent.trim());
    expect(tableHeadersText[0]).toBe('ID');
    expect(tableHeadersText[1]).toBe('Logs');
    expect(tableHeadersText[2]).toBe('Status');
    expect(tableHeadersText[3]).toBe('Test Case');
    expect(tableHeadersText[4]).toBe('Waived');

    // Make sure the correct number of columns show as selected and that only 4 columns
    // are available
    const activeColumnsText = fixture.debugElement.query(By.css('.estuary-table-header__columns-text')).nativeElement;
    expect(activeColumnsText.textContent.trim()).toBe('5 of 6 columns selected');

    // Ensure the actual table content is correct. All 2 entries in the `formattedResults` array
    // should be displayed.
    const rows = fixture.debugElement.queryAll(By.css('.estuary-table tbody > tr'));
    expect(rows.length).toBe(2);
    const rowOneColumns = rows[0].nativeElement.children;

    let idLink = rowOneColumns[0].children[0];
    expect(idLink.tagName).toBe('A');
    expect(idLink.textContent.trim()).toBe('6125319');
    expect(idLink.href).toBe(`${resultsDBURL}results/6125319`);

    let logsLink = rowOneColumns[1].children[0];
    expect(logsLink.tagName).toBe('A');
    expect(logsLink.textContent.trim()).toBe('Test Run Logs');
    expect(logsLink.href).toBe(jenkinsLogURL);

    expect(rowOneColumns[2].textContent.trim()).toBe('PASSED');

    let testCaseLink = rowOneColumns[3].children[0];
    expect(testCaseLink.tagName).toBe('A');
    expect(testCaseLink.textContent.trim()).toBe('rhproduct.default.sanity');
    expect(testCaseLink.href).toBe(`${resultsDBURL}testcases/rhproduct.default.sanity`);


    const rowTwoColumns = rows[1].nativeElement.children;
    idLink = rowTwoColumns[0].children[0];
    expect(idLink.tagName).toBe('A');
    expect(idLink.textContent.trim()).toBe('6125427');
    expect(idLink.href).toBe(`${resultsDBURL}results/6125427`);

    logsLink = rowTwoColumns[1].children[0];
    expect(logsLink.tagName).toBe('A');
    expect(logsLink.textContent.trim()).toBe('Test Run Logs');
    expect(logsLink.href).toBe(jenkinsLogURL);

    expect(rowTwoColumns[2].textContent.trim()).toBe('INFO');

    testCaseLink = rowTwoColumns[3].children[0];
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
      expect(dropdownMenu.children.length).toBe(6);
      const expectedActiveColumns = ['ID', 'Logs', 'Status',  'Test Case', 'Waived'];
      const expectedColumns = ['ID', 'Item', 'Logs', 'Status',  'Test Case', 'Waived'];
      for (let i = 0; i < expectedColumns.length; i++) {
        const columnText = dropdownMenu.children[i].textContent.trim();
        expect(dropdownMenu.children[i].textContent.trim()).toBe(expectedColumns[i]);
        const expectedChecked = expectedActiveColumns.includes(columnText);
        expect(dropdownMenu.children[i].children[0].checked).toBe(expectedChecked);
      }
  }));
});
