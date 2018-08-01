import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastNotificationModule } from 'patternfly-ng/notification';

import { SearchComponent } from './search.component';
import { NodeTypeDisplayPipe } from '../pipes/nodedisplay';
import { AlertComponent } from '../alert/alert.component';
import { PropertyDisplayPipe } from '../pipes/propertydisplay';


describe('SearchComponent testing', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [SearchComponent, AlertComponent, NodeTypeDisplayPipe, PropertyDisplayPipe],
        imports: [FormsModule, ToastNotificationModule, HttpClientTestingModule, RouterTestingModule, NoopAnimationsModule]
    }).compileComponents();
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
  });

  it('should display the search with a populated drop-down and correct placeholder text', fakeAsync(() => {
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
    expect(dropDownOptions[2].text).toBe('Build');
    expect(dropDownOptions[2].value).toBe('kojibuild');
    expect(dropDownOptions[3].text).toBe('Commit');
    expect(dropDownOptions[3].value).toBe('distgitcommit');

    component.selectedResource = 'bugzillabug';
    fixture.detectChanges();
    tick();
    expect(dropdownEl.value).toBe('bugzillabug');
    component.selectedResource = 'distgitcommit';
    fixture.detectChanges();
    tick();
    expect(dropdownEl.value).toBe('distgitcommit');
  }));
});
