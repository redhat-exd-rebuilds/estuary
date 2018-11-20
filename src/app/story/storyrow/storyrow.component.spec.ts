import { By } from '@angular/platform-browser';
import { ComponentFixture, async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { StoryRowComponent } from './storyrow.component';
import { bug } from '../test.data';
import { NodeTypeDisplayPipe, NodeTypePluralPipe, TruncatePipe, NodeDisplayNamePipe } from '../../pipes/nodedisplay';
import { StoryComponent } from '../story.component';
import { GreenwaveService } from '../../services/greenwave.service';


describe('StoryRowComponent testing', () => {
  let component: StoryRowComponent;
  let fixture: ComponentFixture<StoryRowComponent>;
  let greenwaveService: GreenwaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [
            StoryRowComponent,
            NodeTypeDisplayPipe,
            NodeTypePluralPipe,
            TruncatePipe,
            NodeDisplayNamePipe
        ],
        providers: [
          GreenwaveService,
          {provide: StoryComponent, useValue: {connectStory: () => {}}}
        ],
        imports: [
          RouterTestingModule,
          TooltipModule.forRoot(),
          HttpClientTestingModule,
          FontAwesomeModule,
          NoopAnimationsModule,
        ]
    }).compileComponents();

    greenwaveService = TestBed.get(GreenwaveService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryRowComponent);
    component = fixture.componentInstance;
  });

  it('should display single artifact', fakeAsync(() => {
    component.node = bug;
    component.forwardSiblings = 0;
    component.backwardSiblings = 0;
    component.active = true;
    fixture.detectChanges();
    tick();

    // Verify the text is correct
    const nodeUidColEl = fixture.debugElement.query(By.css('.node-uid-column')).nativeElement;
    expect(nodeUidColEl.innerText.trim()).toBe('RHBZ#23456');

    const nodeEl = fixture.debugElement.query(By.css('.node-column__node')).nativeElement;
    // Verify the artifact details are correct
    expect(nodeEl.children[0].tagName).toBe('IMG');
    expect(nodeEl.children[0].src).toContain('circle_single.svg');
    expect(nodeEl.attributes['ng-reflect-tooltip'].value).toBe('Bugzilla Bug RHBZ#23456');
    expect(nodeEl.attributes['ng-reflect-router-link'].value).toBe('/,bugzillabug,23456');
  }));

  it('should display multiple artifacts', fakeAsync(() => {
    component.node = bug;
    component.backwardSiblings = 3;
    component.forwardSiblings = 5;
    component.active = true;
    fixture.detectChanges();
    tick();

    // Verify the text is correct
    const nodeUidColEl = fixture.debugElement.query(By.css('.node-uid-column')).nativeElement;
    expect(nodeUidColEl.innerText.trim()).toBe('RHBZ#23456');

    const siblingsEl = fixture.debugElement.queryAll(By.css('.node-siblings-column__siblings'));
    const siblingsBackwardEl = siblingsEl[0].nativeElement;
    const siblingsForwardEl = siblingsEl[1].nativeElement;
    // Verify the backward siblings are correct
    // For some reason, the whole tooltip text isn't stored in the attribute if it's long,
    // but it still displays properly
    expect(siblingsBackwardEl.attributes['ng-reflect-tooltip'].value).toBe('Bugzilla Bugs related with the');
    expect(siblingsBackwardEl.children[0].tagName).toBe('IMG');
    expect(siblingsBackwardEl.children[0].src).toContain('circle_multi.svg');
    // Verify the badge with "+x" is correct
    const siblingsBackwardBadgeEl = siblingsBackwardEl.querySelector('.node-siblings-column__badge');
    expect(siblingsBackwardBadgeEl.tagName).toBe('DIV');
    expect(siblingsBackwardBadgeEl.innerText).toBe('+3');
    // Verify the forward siblings are correct
    // For some reason, the whole tooltip text isn't stored in the attribute if it's long,
    // but it still displays properly
    expect(siblingsForwardEl.attributes['ng-reflect-tooltip'].value).toBe('Bugzilla Bugs related with the');
    expect(siblingsForwardEl.children[0].tagName).toBe('IMG');
    expect(siblingsForwardEl.children[0].src).toContain('circle_multi.svg');
    // Verify the badge with "+x" is correct
    const siblingsForwardBadgeEl = siblingsForwardEl.querySelector('.node-siblings-column__badge');
    expect(siblingsForwardBadgeEl.tagName).toBe('DIV');
    expect(siblingsForwardBadgeEl.innerText).toBe('+5');
  }));

  it('should call story.connectStory when it\'s the last row', fakeAsync(() => {
    component.node = bug;
    component.forwardSiblings = 0;
    component.backwardSiblings = 0;
    component.active = true;
    component.last = true;
    spyOn(component.story, 'connectStory').and.returnValue(null);
    fixture.detectChanges();
    tick();
    expect(component.story.connectStory).toHaveBeenCalled();
  }));

  it('should display a successful gating decision', fakeAsync(() => {
    spyOn(greenwaveService, 'getArtifactDecision').and.returnValue(
      // Create an observable like the HTTP client would return
      of({
        policies_satisfied: true,
        summary: 'All required tests passsed',
        waivers: [],
      })
    );
    component.node = {
      display_name: 'some-container',
      resource_type: 'ContainerKojiBuild',
    };
    component.forwardSiblings = 0;
    component.backwardSiblings = 0;
    component.active = true;
    // Call setGatingStatus directly since ngOnChanges isn't triggered when directly
    // setting component properties
    component.setGatingStatus();
    fixture.detectChanges();
    tick();
    expect(component.gatingStatus).toEqual({
      icon: faCheck,
      iconClass: 'text-success',
      loading: false,
      statusName: 'Passed',
      summary: 'All required tests passsed',
    });
    const gatingBadgeEl = fixture.debugElement.query(By.css('.node-column__node-gating-badge')).nativeElement;
    // Verify the gating badge is there and has a tooltip
    expect(gatingBadgeEl.attributes['ng-reflect-tooltip'].nodeValue).toBe('All required tests passsed');
  }));
});
