import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { NotificationModule } from 'patternfly-ng/notification';

import { SiblingsComponent } from './siblings.component';
import { SiblingsService } from '../../services/siblings.service';
import { NodeExternalUrlPipe } from '../../pipes/nodedisplay';
import { PropertyDisplayPipe, PropertyValueDisplayPipe } from '../../pipes/propertydisplay';
import { siblings } from '../test.data';


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
        PropertyValueDisplayPipe
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
              queryParams: {
                'displayName': 'RHBZ#1566849'
              }
            }
          }
        },
      ],
      imports: [
        HttpClientTestingModule,
        NotificationModule,
        NoopAnimationsModule
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
    expect(title.textContent).toBe('Siblings of RHBZ#1566849');

    const th = fixture.debugElement.queryAll(By.css('.siblings-table th'));
    expect(th.length).toBe(5);
    expect(th[0].nativeElement.textContent).toBe('ID');
    expect(th[1].nativeElement.textContent).toBe('Assignee');
    expect(th[2].nativeElement.textContent).toBe('Reporter');
    expect(th[3].nativeElement.textContent).toBe('Short Description');
    expect(th[4].nativeElement.textContent).toBe('Status');

    const rows = fixture.debugElement.queryAll(By.css('.siblings-table tbody > tr'));
    expect(rows.length).toBe(2);
    const rowOneColumns = rows[0].nativeElement.children;
    // The first column should contain a link to Bugzilla
    expect(rowOneColumns[0].children[0].tagName).toBe('A');
    expect(rowOneColumns[0].children[0].textContent.trim()).toBe('1566849');
    // The rest of the columns are just text
    expect(rowOneColumns[1].textContent.trim()).toBe('tbrady');
    expect(rowOneColumns[2].textContent.trim()).toBe('user1');
    expect(rowOneColumns[3].textContent.trim()).toBe('CVE-2018-1234 kernel: some error [rhel-7.5.z]');
    expect(rowOneColumns[4].textContent.trim()).toBe('CLOSED');

    const rowTwoColumns = rows[1].nativeElement.children;
    // The first column should contain a link to Bugzilla
    expect(rowTwoColumns[0].children[0].tagName).toBe('A');
    expect(rowTwoColumns[0].children[0].textContent.trim()).toBe('1567084');
    // The rest of the columns are just text
    expect(rowTwoColumns[1].textContent.trim()).toBe('user2');
    expect(rowTwoColumns[2].textContent.trim()).toBe('user1');
    expect(rowTwoColumns[3].textContent.trim()).toBe('CVE-2018-1234 kernel: some error [rhel-7.5.z]');
    expect(rowTwoColumns[4].textContent.trim()).toBe('CLOSED');
  }));
});
