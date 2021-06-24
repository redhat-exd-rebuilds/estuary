import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject } from 'rxjs';

import { GreenwaveService } from '../../services/greenwave.service';
import { TestResultsComponent } from './test-results.component';
import { greenwaveDecision as greenwaveDecisionTestData, containerBuild as cbTestData } from '../../story/test.data';
import { StoryService } from '../../services/story.service';


describe('TestResultsComponent', () => {
  let component: TestResultsComponent;
  let fixture: ComponentFixture<TestResultsComponent>;
  let greenwaveService: GreenwaveService;
  const routeParams = new Subject<Params>();
  let storyService: StoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestResultsComponent],
      providers: [
        GreenwaveService,
        {provide: ActivatedRoute, useValue: {params: routeParams}},
        StoryService,
      ],
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      // This is used to avoid having to import components we don't test here
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    greenwaveService = TestBed.inject(GreenwaveService);
    storyService = TestBed.inject(StoryService);
  });

  it('should get the artifact from the API for a container build', fakeAsync(() => {
    spyOn(storyService, 'getArtifact').and.returnValue(
      // Create an observable like the HTTP client would return
      of(cbTestData)
    );
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

    expect(greenwaveService.getArtifactDecision).toHaveBeenCalledWith(cbTestData, subjectIdentifier);

    expect(component.greenwaveDecision).toBe(greenwaveDecisionTestData);
    expect(component.subjectIdentifier).toBe(subjectIdentifier);
  }));

  it('should not get the artifact from the API for a build', fakeAsync(() => {
    spyOn(greenwaveService, 'getArtifactDecision').and.returnValue(
      // Create an observable like the HTTP client would return
      of(greenwaveDecisionTestData)
    );
    fixture = TestBed.createComponent(TestResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const subjectIdentifier = 'slf4j-1.7.4-4.el7_4';
    // Set the route params to trigger the API to be called
    routeParams.next({'resource': 'build', 'subjectIdentifier': subjectIdentifier});
    fixture.detectChanges();
    tick();

    expect(greenwaveService.getArtifactDecision).toHaveBeenCalledWith('build', subjectIdentifier);

    expect(component.greenwaveDecision).toBe(greenwaveDecisionTestData);
    expect(component.subjectIdentifier).toBe(subjectIdentifier);
  }));
});
