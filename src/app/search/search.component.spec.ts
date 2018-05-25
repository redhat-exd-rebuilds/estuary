import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { NotificationModule } from 'patternfly-ng/notification';

import { SearchComponent } from './search.component';
import { SearchService } from '../services/search.service';
import { KeysPipe } from '../pipes/keyvaluepairs';
import { NodeTypeDisplayPipe } from '../pipes/nodedisplay';
import { AlertComponent } from '../alert/alert.component';


describe('SearchComponent testing', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchService: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [SearchComponent, AlertComponent, KeysPipe, NodeTypeDisplayPipe],
        providers: [SearchService],
        imports: [FormsModule, NotificationModule, HttpClientTestingModule, RouterTestingModule, NoopAnimationsModule]
    }).compileComponents();
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    searchService = TestBed.get(SearchService);
  });

  it('should display the search with a populated drop-down and correct placeholder text', fakeAsync(() => {
    // Mock SearchService.getAvailableResources
    spyOn(searchService, 'getAvailableResources').and.returnValue(
        // Create an observable like the HTTP client would return
        of({
          typeOne: 'id',
          typeTwo: 'name',
          typeThree: 'hash',
          typeFour: 'id'
        })
    );
    fixture.detectChanges();
    tick();

    const alertEl = fixture.debugElement.query(By.css('pfng-toast-notification'));
    expect(alertEl).toBeNull();

    const dropdownEl = fixture.debugElement.query(By.css('select')).nativeElement;
    const dropDownOptions = dropdownEl.children;
    expect(dropDownOptions[0].text).toBe('typeOne');
    expect(dropDownOptions[0].value).toBe('typeOne');
    expect(dropDownOptions[1].text).toBe('typeTwo');
    expect(dropDownOptions[1].value).toBe('typeTwo');
    expect(dropDownOptions[2].text).toBe('typeThree');
    expect(dropDownOptions[2].value).toBe('typeThree');
    expect(dropDownOptions[3].text).toBe('typeFour');
    expect(dropDownOptions[3].value).toBe('typeFour');

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputEl.placeholder).toBe('Enter the id');

    component.selectedResource = 'typeTwo';
    fixture.detectChanges();
    tick();
    expect(dropdownEl.value).toBe('typeTwo');
    expect(inputEl.placeholder).toBe('Enter the name');

    component.selectedResource = 'typeThree';
    fixture.detectChanges();
    tick();
    expect(dropdownEl.value).toBe('typeThree');
    expect(inputEl.placeholder).toBe('Enter the hash');

    component.selectedResource = 'typeFour';
    fixture.detectChanges();
    tick();
    expect(dropdownEl.value).toBe('typeFour');
    expect(inputEl.placeholder).toBe('Enter the id');
  }));

  it('should display an error when the API call fails', fakeAsync(() => {
    // Mock SearchService.getAvailableResources
    spyOn(searchService, 'getAvailableResources').and.returnValue(
      throwError({error: {message: 'The connection failed'}}));
    fixture.detectChanges();
    tick();
    const alertEl = fixture.debugElement.query(By.css('pfng-toast-notification')).nativeElement;
    expect(alertEl).toBeTruthy();
    expect(alertEl.attributes['ng-reflect-message'].nodeValue).toBe('The connection failed');
    expect(alertEl.attributes['ng-reflect-show-close'].nodeValue).toBe('true');
    expect(alertEl.attributes['ng-reflect-type'].nodeValue).toBe('danger');
  }));
});
