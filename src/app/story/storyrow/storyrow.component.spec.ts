import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { StoryRowComponent } from './storyrow.component';
import { bug } from '../test.data';
import { NodeUidDisplayPipe, NodeTypeDisplayPipe, NodeTypePluralPipe, TruncatePipe } from '../../pipes/nodedisplay';
import { StoryComponent } from '../story.component';


describe('StoryRowComponent testing', () => {
  let component: StoryRowComponent;
  let fixture: ComponentFixture<StoryRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [
            StoryRowComponent,
            NodeUidDisplayPipe,
            NodeTypeDisplayPipe,
            NodeTypePluralPipe,
            TruncatePipe
        ],
        providers: [
          {provide: StoryComponent, useValue: {connectStory: () => {}}}
        ],
        imports: [RouterTestingModule, TooltipModule.forRoot()]
    }).compileComponents();
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
    expect(nodeUidColEl.innerText).toBe('RHBZ#23456');

    const nodeEl = fixture.debugElement.query(By.css('.node-column__node')).nativeElement;
    // Verify the artifact details are correct
    expect(nodeEl.children[0].tagName).toBe('IMG');
    expect(nodeEl.children[0].src).toContain('circle_single.svg');
    expect(nodeEl.attributes['ng-reflect-tooltip'].value).toBe('Bugzilla Bug: RHBZ#23456');
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
    expect(nodeUidColEl.innerText).toBe('RHBZ#23456');

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
});
