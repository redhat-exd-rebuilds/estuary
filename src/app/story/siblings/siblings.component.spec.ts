import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { SiblingsComponent } from './siblings.component';
import { SiblingsService } from '../../services/siblings.service';
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
      declarations: [SiblingsComponent],
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
        }
      ],
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      // This is used to avoid having to import components we don't test here
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    siblingsService = TestBed.get(SiblingsService);
  });

  it('should retrieve the siblings of RHBZ#1566849', fakeAsync(() => {
    spyOn(siblingsService, 'getSiblings').and.returnValue(
      // Create an observable like the HTTP client would return
      of(siblings)
    );
    // The component must be created after the spy on the SiblingsService because
    // the SiblingsService is used as part of the constructor
    fixture = TestBed.createComponent(SiblingsComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    expect(component.siblings).toBe(siblings.data);
    expect(component.title).toBe(siblings.meta.description);
  }));
});
