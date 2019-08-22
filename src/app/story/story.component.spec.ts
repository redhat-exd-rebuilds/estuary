import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By, Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ComponentFixture, async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastrModule } from 'ngx-toastr';
import { of, Subject } from 'rxjs';
import { OAuthModule } from 'angular-oauth2-oidc';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { StoryComponent } from './story.component';
import { StorysidebarComponent } from './storysidebar/storysidebar.component';
import { StoryRowComponent } from './storyrow/storyrow.component';
import { TotalTimesComponent } from './storyrow/totaltimes/totaltimes.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { NodeTypeDisplayPipe, NodeTypePluralPipe, NodeExternalUrlPipe,
         TruncatePipe, NodeDisplayNamePipe } from '../pipes/nodedisplay';
import { TimeDisplayPipe } from '../pipes/timedisplay';
import { PropertyDisplayPipe } from '../pipes/propertydisplay';
import { StoryService } from '../services/story.service';
import { bug, story, module_story } from './test.data';
import { GreenwaveService } from '../services/greenwave.service';


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
            NodeTypeDisplayPipe,
            NodeTypePluralPipe,
            NodeExternalUrlPipe,
            PropertyDisplayPipe,
            TruncatePipe,
            TotalTimesComponent,
            SpinnerComponent,
            NavbarComponent,
            NodeDisplayNamePipe,
            TimeDisplayPipe,
        ],
        providers: [
            StoryService,
            DatePipe,
            {provide: ActivatedRoute, useValue: {params: routeParams}},
            GreenwaveService,
            Title,
        ],
        imports: [
            RouterTestingModule,
            TooltipModule.forRoot(),
            HttpClientTestingModule,
            NoopAnimationsModule,
            OAuthModule.forRoot(),
            FontAwesomeModule,
            ToastrModule.forRoot({}),
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

    const storyTitle = TestBed.get(Title);
    expect(storyTitle.getTitle()).toBe('RHBZ#12345 - Estuary');

    const storyRowEls = fixture.debugElement.queryAll(By.css('app-storyrow'));
    // Ensure we get the expected rows
    expect(storyRowEls.length).toBe(6);

    // Ensure the number of columns in the row
    expect(storyRowEls[0].nativeElement.children.length).toBe(4);
    // Ensure the text is correct
    let uidColText = storyRowEls[0].nativeElement.firstElementChild.innerText.trim();
    expect(uidColText).toContain('RHBZ#12345');
    expect(uidColText).toContain('Dec 10, 2018, 12:01:21');
    expect(uidColText).toContain('1m 51s');
    // Ensure the order is correct
    expect(storyRowEls[0].nativeElement.children[1].firstElementChild.id).toBe('js-bugzillabug-node');
    // Ensure the Bugzilla Bug is the active one
    expect(storyRowEls[0].nativeElement.children[1].firstElementChild.classList).toContain('node-column__node--active');
    // Ensure there are Bugzilla Bug siblings shown
    const siblingsDivEl = storyRowEls[0].nativeElement.querySelector('.node-siblings-column__siblings');
    expect(siblingsDivEl.id).toBe('js-bugzillabug-forward-siblings');
    expect(siblingsDivEl.attributes.getNamedItem('ng-reflect-query-params')).toBeTruthy();
    expect(siblingsDivEl.attributes.getNamedItem('ng-reflect-router-link').value).toBe('/siblings/distgitcommit/8a63ad');
    const siblingsBadgeEl = storyRowEls[0].nativeElement.querySelector('.node-siblings-column__badge');
    expect(siblingsBadgeEl.innerText).toBe('+1');

    // Ensure the number of columns in the row
    expect(storyRowEls[1].nativeElement.children.length).toBe(2);
    // Ensure the text is correct
    uidColText = storyRowEls[1].nativeElement.firstElementChild.innerText.trim();
    expect(uidColText).toContain('#8a63adb');
    expect(uidColText).toContain('Dec 10, 2018, 12:01:21');
    expect(uidColText).toContain('37m 2s');
    // Ensure the order is correct
    expect(storyRowEls[1].nativeElement.children[1].firstElementChild.id).toBe('js-distgitcommit-node');
    // Ensure the it is not active
    expect(storyRowEls[1].nativeElement.children[1].firstElementChild.classList).not.toContain('node-column__node--active');

    // Ensure the number of columns in the row
    expect(storyRowEls[2].nativeElement.children.length).toBe(2);
    // Ensure the text is correct
    uidColText = storyRowEls[2].nativeElement.firstElementChild.innerText.trim();
    expect(uidColText).toContain('slf4j-1.7.4-4.e');
    expect(uidColText).toContain('Dec 10, 2018, 12:01:21');
    expect(uidColText).toContain('9h 15m 33s');
    // Ensure the order is correct
    expect(storyRowEls[2].nativeElement.children[1].firstElementChild.id).toBe('js-kojibuild-node');
    // Ensure the it is not active
    expect(storyRowEls[2].nativeElement.children[1].firstElementChild.classList).not.toContain('node-column__node--active');

    // Ensure the number of columns in the row
    expect(storyRowEls[3].nativeElement.children.length).toBe(2);
    // Ensure the text is correct

    uidColText = storyRowEls[3].nativeElement.firstElementChild.innerText.trim();
    expect(uidColText).toContain('RHBA-2017:2251-');
    expect(uidColText).toContain('Dec 10, 2018, 12:01:21');
    expect(uidColText).toContain('5d 3h 27m');
    // Ensure the order is correct
    expect(storyRowEls[3].nativeElement.children[1].firstElementChild.id).toBe('js-advisory-node');
    // Ensure the it is not active
    expect(storyRowEls[3].nativeElement.children[1].firstElementChild.classList).not.toContain('node-column__node--active');

    // Ensure the number of columns in the row
    expect(storyRowEls[4].nativeElement.children.length).toBe(2);
    // Ensure the text is correct
    uidColText = storyRowEls[4].nativeElement.firstElementChild.innerText.trim();
    expect(uidColText).toContain('1180');
    expect(uidColText).toContain('No timestamp available');
    expect(uidColText).toContain('64d 7h 12m');
    // Ensure the order is correct
    expect(storyRowEls[4].nativeElement.children[1].firstElementChild.id).toBe('js-freshmakerevent-node');
    // Ensure the it is not active
    expect(storyRowEls[4].nativeElement.children[1].firstElementChild.classList).not.toContain('node-column__node--active');

    // Ensure the number of columns in the row
    expect(storyRowEls[5].nativeElement.children.length).toBe(2);
    // Ensure the text is correct
    uidColText = storyRowEls[5].nativeElement.firstElementChild.innerText.trim();
    expect(uidColText).toContain('rh-perl520-dock');
    expect(uidColText).toContain('Dec 10, 2018, 12:01:21');
    // Ensure the order is correct
    expect(storyRowEls[5].nativeElement.children[1].firstElementChild.id).toBe('js-containerkojibuild-node');
    // Ensure the it is not active
    expect(storyRowEls[5].nativeElement.children[1].firstElementChild.classList).not.toContain('node-column__node--active');
  }));

  it('should show a module story of Koji build 750095', fakeAsync(() => {
    spyOn(storyService, 'getStory').and.returnValue(
        // Create an observable like the HTTP client would return
        of(module_story)
    );
    fixture.detectChanges();
    // Set the route params to trigger the API to be called
    routeParams.next({'resource': 'kojibuild', 'uid': '750095'});
    fixture.detectChanges();
    tick();

    const storyTitle = TestBed.get(Title);
    expect(storyTitle.getTitle()).toBe('libguestfs-1.38.4-1.el8+1579+44551958 - Estuary');

    const storyRowEls = fixture.debugElement.queryAll(By.css('app-storyrow'));
    // Ensure we get the expected rows
    expect(storyRowEls.length).toBe(3);

    // Ensure the number of columns in the row
    expect(storyRowEls[0].nativeElement.children.length).toBe(3);
    // Ensure the text is correct
    let uidColText = storyRowEls[0].nativeElement.firstElementChild.innerText.trim();
    expect(uidColText).toContain('#d11fcbf');
    expect(uidColText).toContain('Dec 10, 2018, 12:01:21');
    expect(uidColText).toContain('1m 51s');
    // Ensure the order is correct
    expect(storyRowEls[0].nativeElement.children[1].firstElementChild.id).toBe('js-distgitcommit-node');
    // Ensure the DistGitCommit is not the active one
    expect(storyRowEls[0].nativeElement.children[1].firstElementChild.classList).not.toContain('node-column__node--active');

    // Ensure the number of columns in the row
    expect(storyRowEls[1].nativeElement.children.length).toBe(3);
    // Ensure the text is correct
    uidColText = storyRowEls[1].nativeElement.firstElementChild.innerText.trim();
    expect(uidColText).toContain('libguestfs-1.38');
    expect(uidColText).toContain('Dec 10, 2018, 12:01:21');
    expect(uidColText).toContain('37m 2s');
    // Ensure the order is correct
    expect(storyRowEls[1].nativeElement.children[1].firstElementChild.id).toBe('js-kojibuild-node');
    // Ensure the Koji Build is the active one
    expect(storyRowEls[1].nativeElement.children[1].firstElementChild.classList).toContain('node-column__node--active');
    // Ensure there are Koji Build siblings shown
    const siblingsDivEl = storyRowEls[1].nativeElement.querySelector('.node-siblings-column__siblings');
    expect(siblingsDivEl.id).toBe('js-kojibuild-forward-siblings');
    const siblingsBadgeEl = storyRowEls[1].nativeElement.querySelector('.node-siblings-column__badge');
    expect(siblingsBadgeEl.innerText).toBe('+17');

    // Ensure the number of columns in the row
    expect(storyRowEls[2].nativeElement.children.length).toBe(2);
    // Ensure the text is correct
    uidColText = storyRowEls[2].nativeElement.firstElementChild.innerText.trim();
    expect(uidColText).toContain('virt-rhel-20180');
    expect(uidColText).toContain('Dec 10, 2018, 12:01:21');
    // Ensure the order is correct
    expect(storyRowEls[2].nativeElement.children[1].firstElementChild.id).toBe('js-modulekojibuild-node');
    // Ensure the ModuleKojiBuild is not active
    expect(storyRowEls[2].nativeElement.children[1].firstElementChild.classList).not.toContain('node-column__node--active');
  }));
});
