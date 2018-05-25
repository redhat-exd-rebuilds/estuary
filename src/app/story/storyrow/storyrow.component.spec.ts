import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { StoryRowComponent, PlumbConnectDirective } from './storyrow.component';
import { bug } from '../test.data';
import { NodeUidDisplayPipe, NodeTypeDisplayPipe, NodeTypePluralPipe } from '../../pipes/nodedisplay';


describe('StoryRowComponent testing', () => {
  let component: StoryRowComponent;
  let fixture: ComponentFixture<StoryRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [
            StoryRowComponent,
            PlumbConnectDirective,
            NodeUidDisplayPipe,
            NodeTypeDisplayPipe,
            NodeTypePluralPipe
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
    const mainItemTextEl = fixture.debugElement.query(By.css('.mainItemText')).nativeElement;
    expect(mainItemTextEl.innerText).toBe('RHBZ#23456');

    const artifactEl = fixture.debugElement.query(By.css('#BugzillaBugPrimary')).nativeElement;
    // Verify the artifact details are correct
    expect(artifactEl.children[0].tagName).toBe('I');
    expect(artifactEl.children[0].classList).toContain('fa-bug');
    expect(artifactEl.attributes['ng-reflect-tooltip'].value).toBe('Bugzilla Bug: RHBZ#23456');
    expect(artifactEl.attributes['ng-reflect-router-link'].value).toBe('/,bugzillabug,23456');
  }));

  it('should display multiple artifacts', fakeAsync(() => {
    component.node = bug;
    component.relatedNodes = 5;
    component.active = true;
    fixture.detectChanges();
    tick();

    // Verify the text is correct
    const mainItemTextEl = fixture.debugElement.query(By.css('.mainItemText')).nativeElement;
    expect(mainItemTextEl.innerText).toBe('RHBZ#23456');

    const secondaryArtifactEl = fixture.debugElement.query(By.css('#BugzillaBugSecondary')).nativeElement;
    // Verify the secondary artifact details are correct
    expect(secondaryArtifactEl.children[0].tagName).toBe('I');
    expect(secondaryArtifactEl.children[0].classList).toContain('fa-bug');
    expect(secondaryArtifactEl.attributes['ng-reflect-tooltip'].value).toBe('Related Bugzilla Bugs');

    const secondaryItemTextEl = fixture.debugElement.query(By.css('.secondaryItemText')).nativeElement;
    expect(secondaryItemTextEl.innerText).toBe('5 more');
  }));
});
