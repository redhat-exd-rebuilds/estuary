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
    component.relatedNodes = 0;
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
    component.relatedNodes = 5;
    component.active = true;
    fixture.detectChanges();
    tick();

    // Verify the text is correct
    const nodeUidColEl = fixture.debugElement.query(By.css('.node-uid-column')).nativeElement;
    expect(nodeUidColEl.innerText).toBe('RHBZ#23456');

    const siblingsEl = fixture.debugElement.query(By.css('.node-column__siblings')).nativeElement;
    // Verify the secondary artifact details are correct
    expect(siblingsEl.children[0].tagName).toBe('IMG');
    expect(siblingsEl.children[0].src).toContain('circle_multi.svg');
    expect(siblingsEl.attributes['ng-reflect-tooltip'].value).toBe('Related Bugzilla Bugs');

    const siblingsTextEl = fixture.debugElement.query(By.css('.node-siblings-text-column')).nativeElement;
    expect(siblingsTextEl.innerText).toBe('5 more');
  }));

  it('should call story.connectStory when it\'s the last row', fakeAsync(() => {
    component.node = bug;
    component.relatedNodes = 0;
    component.active = true;
    component.last = true;
    spyOn(component.story, 'connectStory').and.returnValue(null);
    fixture.detectChanges();
    tick();
    expect(component.story.connectStory).toHaveBeenCalled();
  }));
});
