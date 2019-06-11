import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ToastNotificationModule } from 'patternfly-ng/notification';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { EstuaryTableComponent } from './table.component';
import { TruncateModalComponent } from './truncate-modal/truncate-modal.component';
import { TruncatePipe } from '../pipes/nodedisplay';


describe('EstuaryTableComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  // Create a dummy component that just has the EstuaryTableComponent so that way
  // we don't have to fake the ngOnChanges method
  @Component({
    selector: 'app-test-host',
    template: `<app-table
                  [title]="title"
                  [titleLink]="titleLink"
                  [items]="items"
                  [defaultColumns]="defaultColumns"
                  [defaultSortedColumn]="defaultSortedColumn"
                  [uidColumn]="uidColumn"
                  [linkColumnMappings]="linkColumnMappings"
               ></app-table>`
  })
  class TestHostComponent {
    // All the inputs to EstuaryTableComponent are defined here
    title: string;
    titleLink: string;
    items: Array<any>;
    defaultColumns: Array<string>;
    defaultSortedColumn: string;
    uidColumn: string;
    linkColumnMappings: any;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestHostComponent,
        EstuaryTableComponent,
        TruncateModalComponent,
        TruncatePipe,
      ],
      imports: [
        NoopAnimationsModule,
        ToastNotificationModule,
        ModalModule.forRoot(),
        BsDropdownModule.forRoot(),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.items = [
      {
        'ID': 3,
        'Artist': 'Aerosmith',
        'Best Album': 'Toys in the Attic',
        'Year Formed': 1970,
      },
      {
        'ID': 4,
        'Artist': 'The Beatles',
        'Best Album': 'Please Please Me',
        'Year Formed': 1960,
      },
      {
        'ID': 1,
        'Artist': 'The Eagles',
        'Best Album': 'Hotel California',
        'Year Formed': 1971,
      },
      {
        'ID': 5,
        'Artist': 'Unknown Artist',
        'Best Album': 'Some very long album that is longer than 50 characters and does not make sense',
        'Year Formed': 2018,
      }
    ];
    component.title = 'Classic Rock Bands';
    component.defaultColumns = ['ID', 'Artist', 'Best Album'];
    component.defaultSortedColumn = 'ID';
    component.uidColumn = 'ID';
    component.linkColumnMappings = {
      3: {'ID': 'https://en.wikipedia.org/wiki/Toys_in_the_Attic_(album)'},
      4: {'ID': 'https://en.wikipedia.org/wiki/Please_Please_Me'},
      1: {'ID': 'https://en.wikipedia.org/wiki/Hotel_California_(Eagles_album)'},
      5: {'ID': 'https://en.wikipedia.org/wiki/Unknown'},
    };
    fixture.detectChanges();
  });

  it('should show the table', fakeAsync(() => {
    // Ensure the title on the page is correct
    const title = fixture.debugElement.query(By.css('.table-title')).nativeElement;
    expect(title.textContent.trim()).toBe('Classic Rock Bands');

    // Ensure the table headers show only the default columns
    const tableHeaders = fixture.debugElement.queryAll(By.css('.estuary-table th'));
    expect(tableHeaders.length).toBe(3);
    expect(tableHeaders[0].nativeElement.textContent.trim()).toBe('Artist');
    expect(tableHeaders[1].nativeElement.textContent.trim()).toBe('Best Album');
    expect(tableHeaders[2].nativeElement.textContent.trim()).toBe('ID');

    // Make sure the correct number of columns show as selected and that only four columns
    // are available
    const activeColumnsText = fixture.debugElement.query(By.css('.estuary-table-header__columns-text')).nativeElement;
    expect(activeColumnsText.textContent.trim()).toBe('3 of 4 columns selected');

    // Ensure the actual table content is correct. All 4 entries in the `items` array
    // should be displayed.
    const rows = fixture.debugElement.queryAll(By.css('.estuary-table tbody > tr'));
    expect(rows.length).toBe(4);

    // Make sure the number of items corresponds to what we say is shown in the label
    const numItemsLabel = fixture.debugElement.query(By.css('.estuary-table-header__num-elements')).nativeElement;
    expect(numItemsLabel.textContent.trim()).toBe('Showing ' + rows.length + ' items');

    // Validate the text in row one. It should start with "The Eagles" since that has the first ID
    // and the sorting is by the `ID` column by default.
    const rowOneColumns = rows[0].nativeElement.children;
    expect(rowOneColumns[0].textContent.trim()).toBe('The Eagles');
    expect(rowOneColumns[1].textContent.trim()).toBe('Hotel California');
    // The ID column should contain a link to Wikipedia
    expect(rowOneColumns[2].textContent.trim()).toBe('1');
    const rowOneLink = rowOneColumns[2].children[0];
    expect(rowOneLink.tagName).toBe('A');
    expect(rowOneLink.textContent.trim()).toBe('1');
    expect(rowOneLink.href).toBe('https://en.wikipedia.org/wiki/Hotel_California_(Eagles_album)');

    const rowTwoColumns = rows[1].nativeElement.children;
    expect(rowTwoColumns[0].textContent.trim()).toBe('Aerosmith');
    expect(rowTwoColumns[1].textContent.trim()).toBe('Toys in the Attic');
    // The ID column should contain a link to Wikipedia
    expect(rowTwoColumns[2].textContent.trim()).toBe('3');
    const rowTwoLink = rowTwoColumns[2].children[0];
    expect(rowTwoLink.tagName).toBe('A');
    expect(rowTwoLink.textContent.trim()).toBe('3');
    expect(rowTwoLink.href).toBe('https://en.wikipedia.org/wiki/Toys_in_the_Attic_(album)');

    const rowThreeColumns = rows[2].nativeElement.children;
    expect(rowThreeColumns[0].textContent.trim()).toBe('The Beatles');
    expect(rowThreeColumns[1].textContent.trim()).toBe('Please Please Me');
    // The ID column should contain a link to Wikipedia
    expect(rowThreeColumns[2].textContent.trim()).toBe('4');
    const rowThreeLink = rowThreeColumns[2].children[0];
    expect(rowThreeLink.tagName).toBe('A');
    expect(rowThreeLink.textContent.trim()).toBe('4');
    expect(rowThreeLink.href).toBe('https://en.wikipedia.org/wiki/Please_Please_Me');

    const rowFourColumns = rows[3].nativeElement.children;
    expect(rowFourColumns[0].textContent.trim()).toBe('Unknown Artist');
    // Make sure the text is truncated because the TruncateModal should be used here
    expect(rowFourColumns[1].textContent.trim()).toBe('Some very long album that is longer than 50 charac…');
    const truncateModal = rowFourColumns[1].firstElementChild;
    expect(truncateModal.tagName).toBe('APP-TRUNCATE-MODAL');
    const modalLink = truncateModal.firstElementChild;
    // Click the modal and check to make sure it displays
    modalLink.click();
    // Tick one second for the modal to appear
    tick(1000);
    // We must use document.querySelector instead of using the fixture because
    // ngx-bootstrap displays the modal outside of the component
    const modalHeader = document.querySelector('.modal-title');
    expect(modalHeader.textContent.trim()).toBe('Best Album');
    const modalBody = document.querySelector('.modal-body');
    expect(modalBody.textContent.trim()).toBe(
      'Some very long album that is longer than 50 characters and does not make sense');
    const closeBtn: HTMLElement = document.querySelector('button.close');
    closeBtn.click();
    // Tick one second for the modal to close
    tick(1000);
    // The ID column should contain a link to Wikipedia
    expect(rowFourColumns[2].textContent.trim()).toBe('5');
    const rowFourLink = rowFourColumns[2].children[0];
    expect(rowFourLink.tagName).toBe('A');
    expect(rowFourLink.textContent.trim()).toBe('5');
    expect(rowFourLink.href).toBe('https://en.wikipedia.org/wiki/Unknown');
  }));

  it('should show the title link', fakeAsync(() => {
    const href = 'https://en.wikipedia.org/wiki/Classic_rock';
    component.titleLink = href;
    fixture.detectChanges();
    // Ensure the title and title link on the page are correct
    const title = fixture.debugElement.query(By.css('.table-title')).nativeElement;
    expect(title.textContent.trim()).toBe('Classic Rock Bands');
    const titleLink = title.firstElementChild;
    expect(titleLink.tagName).toBe('A');
    expect(titleLink.href).toBe(href);
  }));

  it('should allow columns to be selected', fakeAsync(() => {
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
    // Expect there to be 4 columns to be able to check
    expect(dropdownMenu.children.length).toBe(4);
    const expectedActiveColumns = ['Artist', 'Best Album', 'ID'];
    const expectedColumns = ['Artist', 'Best Album', 'ID', 'Year Formed'];
    for (let i = 0; i < expectedColumns.length; i++) {
      const columnText = dropdownMenu.children[i].textContent.trim();
      expect(dropdownMenu.children[i].textContent.trim()).toBe(expectedColumns[i]);
      const expectedChecked = expectedActiveColumns.includes(columnText);
      expect(dropdownMenu.children[i].children[0].checked).toBe(expectedChecked);
    }

    // Check the "Year Formed" column since it's not displayed by default
    const yearFormedCheckBox = dropdownMenu.children[3].children[0];
    yearFormedCheckBox.click();
    // Have Angular reflect the changes
    fixture.detectChanges();
    // Check to make sure all the default columns and "Year Formed" are displayed
    let tableHeaders = fixture.debugElement.queryAll(By.css('.estuary-table th'));
    expect(tableHeaders.length).toBe(4);
    const tableHeadersText = tableHeaders.map(v => v.nativeElement.textContent.trim());
    expect(tableHeadersText[0]).toBe('Artist');
    expect(tableHeadersText[1]).toBe('Best Album');
    expect(tableHeadersText[2]).toBe('ID');
    expect(tableHeadersText[3]).toBe('Year Formed');

    // Now uncheck the "Artist" column which is currently shown
    const artistCheckBox = dropdownMenu.children[0].children[0];
    artistCheckBox.click();
    // Have Angular reflect the changes
    fixture.detectChanges();
    // Check to make sure the "Artist" column is no longer present
    tableHeaders = fixture.debugElement.queryAll(By.css('.estuary-table th'));
    expect(tableHeaders.length).toBe(3);
    expect(tableHeaders[0].nativeElement.textContent.trim()).toBe('Best Album');
    expect(tableHeaders[1].nativeElement.textContent.trim()).toBe('ID');
    expect(tableHeaders[2].nativeElement.textContent.trim()).toBe('Year Formed');
  }));

  it('should show allow the table be exported to a CSV', fakeAsync(() => {
    // Create a spy object with a click() method to simulate the dynamically created link
    // after clicking on the "Export CSV" button
    const spyLink = jasmine.createSpyObj(['click']);
    // Spy on document.createElement() and return the fake link
    spyOn(document, 'createElement').and.returnValue(spyLink);

    const exportBtn = fixture.debugElement.query(By.css('.estuary-table-header__export-btn'));
    exportBtn.nativeElement.click();
    // Make sure a link was created
    expect(document.createElement).toHaveBeenCalledTimes(1);
    expect(document.createElement).toHaveBeenCalledWith('a');
    // Make sure the link was generated with the CSV data
    expect(spyLink.href).toBe('data:text/csv;charset=utf-8,ID,Artist,Best%20Album%0A1,%22The%20Eagles%22,' +
                              '%22Hotel%20California%22%0A3,%22Aerosmith%22,%22Toys%20in%20the%20Attic%22%0A4,' +
                              '%22The%20Beatles%22,%22Please%20Please%20Me%22%0A5,%22Unknown%20Artist%22,' +
                              '%22Some%20very%20long%20album%20that%20is%20longer%20than%2050%20characters%20' +
                              'and%20does%20not%20make%20sense%22%0A');
    expect(spyLink.target).toBe('_blank');
    expect(spyLink.download).toBe('classic_rock_bands.csv');
    // Make sure the link was clicked to trigger the download
    expect(spyLink.click).toHaveBeenCalledTimes(1);
  }));
});
