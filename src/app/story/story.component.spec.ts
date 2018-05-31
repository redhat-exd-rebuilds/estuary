import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentFixture, async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NotificationModule } from 'patternfly-ng/notification';
import { of, Subject } from 'rxjs';

import { StoryComponent } from './story.component';
import { StorysidebarComponent } from './storysidebar/storysidebar.component';
import { StoryRowComponent, PlumbConnectDirective } from './storyrow/storyrow.component';
import { AlertComponent } from '../alert/alert.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NodeUidDisplayPipe, NodeTypeDisplayPipe, NodeTypePluralPipe, NodeExternalUrlPipe } from '../pipes/nodedisplay';
import { PropertyDisplayPipe } from '../pipes/propertydisplay';
import { StoryService } from '../services/story.service';
import { bug, story } from './test.data';


describe('StoryComponent testing', () => {
  let component: StoryComponent;
  let fixture: ComponentFixture<StoryComponent>;
  let storyService: StoryService;
  const routeParams = new Subject<Params>();

  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [
            StoryComponent,
            StoryRowComponent,
            StorysidebarComponent,
            PlumbConnectDirective,
            NodeUidDisplayPipe,
            NodeTypeDisplayPipe,
            NodeTypePluralPipe,
            NodeExternalUrlPipe,
            PropertyDisplayPipe,
            AlertComponent,
            SpinnerComponent
        ],
        providers: [
            StoryService,
            {provide: ActivatedRoute, useValue: {params: routeParams}}
        ],
        imports: [
            RouterTestingModule,
            TooltipModule.forRoot(),
            NotificationModule,
            HttpClientTestingModule,
            NoopAnimationsModule
        ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryComponent);
    component = fixture.componentInstance;
    storyService = TestBed.get(StoryService);
  });

  it('should show a story of Bugzilla bug 12345', fakeAsync(() => {
    spyOn(storyService, 'getStory').and.returnValue(
        // Create an observable like the HTTP client would return
        of(story)
    );
    fixture.detectChanges();
    // Set the route params to trigger the API to be called
    routeParams.next({'resource': 'bugzillabug', 'uid': '12345'});
    fixture.detectChanges();
    tick();

    const storyRowEls = fixture.debugElement.queryAll(By.css('app-storyrow'));
    // Ensure we get the expected rows
    expect(storyRowEls.length).toBe(6);

    // Ensure the number of columns in the row
    expect(storyRowEls[0].nativeElement.children.length).toBe(4);
    // Ensure the text is correct
    expect(storyRowEls[0].nativeElement.firstElementChild.innerText).toBe('RHBZ#12345');
    // Ensure the order is correct
    expect(storyRowEls[0].nativeElement.children[1].firstElementChild.id).toBe('BugzillaBugPrimary');
    // Ensure the Bugzilla Bug is the active one
    expect(storyRowEls[0].nativeElement.children[1].firstElementChild.classList).toContain('active');
    // Ensure a secondary Bugzilla Bug is shown
    expect(storyRowEls[0].nativeElement.children[2].firstElementChild.id).toBe('BugzillaBugSecondary');
    // Ensure the secondary Bugzilla Bug text is shown
    expect(storyRowEls[0].nativeElement.children[3].innerText).toBe('1 more');

    // Ensure the number of columns in the row
    expect(storyRowEls[1].nativeElement.children.length).toBe(2);
    // Ensure the text is correct
    expect(storyRowEls[1].nativeElement.firstElementChild.innerText).toBe('#8a63adb');
    // Ensure the order is correct
    expect(storyRowEls[1].nativeElement.children[1].firstElementChild.id).toBe('DistGitCommitPrimary');
    // Ensure the it is not active
    expect(storyRowEls[1].nativeElement.children[1].firstElementChild.classList).not.toContain('active');

    // Ensure the number of columns in the row
    expect(storyRowEls[2].nativeElement.children.length).toBe(2);
    // Ensure the text is correct
    expect(storyRowEls[2].nativeElement.firstElementChild.innerText).toBe('slf4j-1.7.4-4.el7_4');
    // Ensure the order is correct
    expect(storyRowEls[2].nativeElement.children[1].firstElementChild.id).toBe('KojiBuildPrimary');
    // Ensure the it is not active
    expect(storyRowEls[2].nativeElement.children[1].firstElementChild.classList).not.toContain('active');

    // Ensure the number of columns in the row
    expect(storyRowEls[3].nativeElement.children.length).toBe(2);
    // Ensure the text is correct
    expect(storyRowEls[3].nativeElement.firstElementChild.innerText).toBe('RHBA-2017:2251-02');
    // Ensure the order is correct
    expect(storyRowEls[3].nativeElement.children[1].firstElementChild.id).toBe('AdvisoryPrimary');
    // Ensure the it is not active
    expect(storyRowEls[3].nativeElement.children[1].firstElementChild.classList).not.toContain('active');

    // Ensure the number of columns in the row
    expect(storyRowEls[4].nativeElement.children.length).toBe(2);
    // Ensure the text is correct
    expect(storyRowEls[4].nativeElement.firstElementChild.innerText).toBe('1180');
    // Ensure the order is correct
    expect(storyRowEls[4].nativeElement.children[1].firstElementChild.id).toBe('FreshmakerEventPrimary');
    // Ensure the it is not active
    expect(storyRowEls[4].nativeElement.children[1].firstElementChild.classList).not.toContain('active');

    // Ensure the number of columns in the row
    expect(storyRowEls[5].nativeElement.children.length).toBe(2);
    // Ensure the text is correct
    expect(storyRowEls[5].nativeElement.firstElementChild.innerText).toBe('397');
    // Ensure the order is correct
    expect(storyRowEls[5].nativeElement.children[1].firstElementChild.id).toBe('ContainerBuildPrimary');
    // Ensure the it is not active
    expect(storyRowEls[5].nativeElement.children[1].firstElementChild.classList).not.toContain('active');
  }));
});
