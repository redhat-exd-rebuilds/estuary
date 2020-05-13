import { By } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { StorysidebarComponent } from './storysidebar.component';
import { NodeExternalUrlPipe, TruncatePipe, NodeDisplayNamePipe } from '../../pipes/nodedisplay';
import { PropertyDisplayPipe, PropertyValueDisplayPipe } from '../../pipes/propertydisplay';
import { bug } from '../test.data';


describe('StorysidebarComponent testing', () => {
  let component: StorysidebarComponent;
  let fixture: ComponentFixture<StorysidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [
            StorysidebarComponent,
            NodeExternalUrlPipe,
            PropertyDisplayPipe,
            PropertyValueDisplayPipe,
            TruncatePipe,
            NodeDisplayNamePipe
        ],
        providers: [
          DatePipe
        ],
        imports: [
          TooltipModule.forRoot(),
          RouterTestingModule,
          NoopAnimationsModule,
        ]
    }).compileComponents();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(StorysidebarComponent);
    component = fixture.componentInstance;
    component.sidebarOpen = true;
    bug.short_description = 'A very long description. A very long description. ' +
                            'A very long description. A very long description. ' +
                            'A very long description. A very long description. ' +
                            'A very long description. A very long description.' +
                            'A very long description. A very long description.';
    component.node = bug;
    fixture.detectChanges();
    // Have to call this directly or it never gets called
    component.ngOnChanges();
    fixture.detectChanges();
  }));

  it('should display the input node when the sidebar is open', fakeAsync(() => {
    const titleAnchorEl = fixture.debugElement.query(By.css('.sidebar a[target="_blank"]')).nativeElement;
    expect(titleAnchorEl.href).toBe('https://bugzilla.redhat.com/show_bug.cgi?id=23456');
    const titleEl = fixture.debugElement.query(By.css('.sidebar__external-system-link > h2')).nativeElement;
    expect(titleEl.textContent).toBe('RHBZ#23456');
    const sidebarPropertiesEl = fixture.debugElement.query(By.css('.sidebar-properties > tbody')).nativeElement;
    expect(sidebarPropertiesEl.children.length).toBe(19);
    expect(sidebarPropertiesEl.children[0].children[0].textContent).toBe('Assignee');
    expect(sidebarPropertiesEl.children[0].children[1].textContent.trim()).toBe('user1');
    expect(sidebarPropertiesEl.children[1].children[0].textContent).toBe('Attached Advisories');
    expect(sidebarPropertiesEl.children[1].children[1].children[0].tagName).toBe('A');
    expect(sidebarPropertiesEl.children[1].children[1].textContent.trim()).toBe('RHSA-2018:1234-01');
    expect(sidebarPropertiesEl.children[2].children[0].textContent).toBe('Creation Time');
    expect(sidebarPropertiesEl.children[2].children[1].textContent.trim()).toBe('March 5, 2018, 20:29:03 UTC');
    expect(sidebarPropertiesEl.children[3].children[0].textContent).toBe('ID');
    expect(sidebarPropertiesEl.children[3].children[1].textContent.trim()).toBe('23456');
    expect(sidebarPropertiesEl.children[4].children[0].textContent).toBe('Modified Time');
    expect(sidebarPropertiesEl.children[4].children[1].textContent.trim()).toBe('March 26, 2018, 15:53:52 UTC');
    expect(sidebarPropertiesEl.children[5].children[0].textContent).toBe('Priority');
    expect(sidebarPropertiesEl.children[5].children[1].textContent.trim()).toBe('high');
    expect(sidebarPropertiesEl.children[6].children[0].textContent).toBe('Product Name');
    expect(sidebarPropertiesEl.children[6].children[1].textContent.trim()).toBe('Red Hat Enterprise Linux 7');
    expect(sidebarPropertiesEl.children[7].children[0].textContent).toBe('Product Version');
    expect(sidebarPropertiesEl.children[7].children[1].textContent.trim()).toBe('7.4');
    expect(sidebarPropertiesEl.children[8].children[0].textContent).toBe('QA Contact');
    expect(sidebarPropertiesEl.children[8].children[1].textContent.trim()).toBe('user2');
    expect(sidebarPropertiesEl.children[9].children[0].textContent).toBe('Related By Commits');
    expect(sidebarPropertiesEl.children[9].children[1].textContent.trim()).toBe('--');
    expect(sidebarPropertiesEl.children[10].children[0].textContent).toBe('Reporter');
    expect(sidebarPropertiesEl.children[10].children[1].textContent.trim()).toBe('user3');
    expect(sidebarPropertiesEl.children[11].children[0].textContent).toBe('Resolution');
    expect(sidebarPropertiesEl.children[11].children[1].textContent.trim()).toBe('ERRATA');
    expect(sidebarPropertiesEl.children[12].children[0].textContent).toBe('Resolved By Commits');
    expect(sidebarPropertiesEl.children[12].children[1].children[0].tagName).toBe('A');
    expect(sidebarPropertiesEl.children[12].children[1].textContent.trim()).toBe('1');
    expect(sidebarPropertiesEl.children[13].children[0].textContent).toBe('Reverted By Commits');
    expect(sidebarPropertiesEl.children[13].children[1].textContent.trim()).toBe('--');
    expect(sidebarPropertiesEl.children[14].children[0].textContent).toBe('Severity');
    expect(sidebarPropertiesEl.children[14].children[1].textContent.trim()).toBe('high');
    expect(sidebarPropertiesEl.children[15].children[0].textContent).toBe('Short Description');
    // Truncated text length
    expect(sidebarPropertiesEl.children[15].children[1].textContent.trim().length).toBe(151);
    expect(sidebarPropertiesEl.children[16].children[0].textContent).toBe('Status');
    expect(sidebarPropertiesEl.children[16].children[1].textContent.trim()).toBe('CLOSED');
    expect(sidebarPropertiesEl.children[17].children[0].textContent).toBe('Target Milestone');
    expect(sidebarPropertiesEl.children[17].children[1].textContent.trim()).toBe('rc');
  }));

  it('should truncate long property values', () => {
    const sidebarPropertiesEl = fixture.debugElement.query(By.css('.sidebar-properties > tbody')).nativeElement;
    // Make sure the expand/unexpand (truncate) button works
    const truncateAnchorEl = sidebarPropertiesEl.children[15].children[1].children[0];
    expect(truncateAnchorEl.tagName).toBe('A');
    const truncateIconEl = truncateAnchorEl.children[0];
    expect(truncateIconEl.tagName).toBe('I');
    expect(truncateIconEl.classList).toContain('fa-angle-down');
    // Expand the text
    truncateAnchorEl.click();
    fixture.detectChanges();
    expect(sidebarPropertiesEl.children[15].children[1].textContent.length).toBe(248);
    expect(truncateIconEl.classList).toContain('fa-angle-up');
  });

  it('should not display the input node when the sidebar is closed', fakeAsync(() => {
    component.sidebarOpen = false;
    fixture.detectChanges();
    tick();

    const titleAnchorEl = fixture.debugElement.query(By.css('.sidebar a[target="_blank"]'));
    expect(titleAnchorEl).toBeNull();
    const titleEl = fixture.debugElement.query(By.css('.sidebar > a > h3'));
    expect(titleEl).toBeNull();
    const sidebarPropertiesEl = fixture.debugElement.query(By.css('.sidebar-properties'));
    expect(sidebarPropertiesEl).toBeNull();
  }));
});
