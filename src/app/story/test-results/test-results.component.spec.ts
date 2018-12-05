import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject } from 'rxjs';

import { GreenwaveService } from '../../services/greenwave.service';
import { TestResultsComponent } from './test-results.component';
import { greenwaveDecision as greenwaveDecisionTestData } from '../../story/test.data';


describe('TestResultsComponent', () => {
  let component: TestResultsComponent;
  let fixture: ComponentFixture<TestResultsComponent>;
  let greenwaveService: GreenwaveService;
  const routeParams = new Subject<Params>();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestResultsComponent],
      providers: [
        GreenwaveService,
        {provide: ActivatedRoute, useValue: {params: routeParams}},
      ],
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      // This is used to avoid having to import components we don't test here
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    greenwaveService = TestBed.get(GreenwaveService);
  });

  it('should create', fakeAsync(() => {
    spyOn(greenwaveService, 'getArtifactDecision').and.returnValue(
      // Create an observable like the HTTP client would return
      of(greenwaveDecisionTestData)
    );
    fixture = TestBed.createComponent(TestResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const subjectIdentifier = 'cfme-openshift-app-ui-container-5.9.3.4-1.1533127933';
    // Set the route params to trigger the API to be called
    routeParams.next({'resource': 'containerbuild', 'subjectIdentifier': subjectIdentifier});
    fixture.detectChanges();
    tick();

    expect(component.greenwaveDecision).toBe(greenwaveDecisionTestData);
    expect(component.subjectIdentifier).toBe(subjectIdentifier);
  }));
});
