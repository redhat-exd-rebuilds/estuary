import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ToastNotificationModule } from 'patternfly-ng/notification';

import { SearchComponent } from './search.component';
import { SearchService } from '../services/search.service';
import { NodeTypeDisplayPipe } from '../pipes/nodedisplay';
import { AlertComponent } from '../alert/alert.component';
import { PropertyDisplayPipe } from '../pipes/propertydisplay';


describe('SearchComponent testing', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchService: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [SearchComponent, AlertComponent, NodeTypeDisplayPipe, PropertyDisplayPipe],
        providers: [SearchService],
        imports: [FormsModule, ToastNotificationModule, HttpClientTestingModule, RouterTestingModule, NoopAnimationsModule]
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
          'advisory': 'id',
          'bugzillabug': 'id',
          'distgitcommit': 'hash'
        })
    );
    fixture.detectChanges();
    tick();

    const alertEl = fixture.debugElement.query(By.css('pfng-toast-notification'));
    expect(alertEl).toBeNull();

    const dropdownEl = fixture.debugElement.query(By.css('select')).nativeElement;
    const dropDownOptions = dropdownEl.children;
    expect(dropDownOptions[0].text).toBe('Advisory');
    expect(dropDownOptions[0].value).toBe('advisory');
    expect(dropDownOptions[1].text).toBe('Bugzilla Bug');
    expect(dropDownOptions[1].value).toBe('bugzillabug');
    expect(dropDownOptions[2].text).toBe('Commit');
    expect(dropDownOptions[2].value).toBe('distgitcommit');

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    component.selectedResource = 'bugzillabug';
    fixture.detectChanges();
    tick();
    expect(dropdownEl.value).toBe('bugzillabug');
    component.selectedResource = 'distgitcommit';
    fixture.detectChanges();
    tick();
    expect(dropdownEl.value).toBe('distgitcommit');
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
