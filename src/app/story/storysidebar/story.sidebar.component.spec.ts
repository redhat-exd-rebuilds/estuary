import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { StorysidebarComponent } from './storysidebar.component';
import { NodeUidDisplayPipe, NodeExternalUrlPipe } from '../../pipes/nodedisplay';
import { PropertyDisplayPipe } from '../../pipes/propertydisplay';
import { bug } from '../test.data';


describe('SpinnerComponent testing', () => {
  let component: StorysidebarComponent;
  let fixture: ComponentFixture<StorysidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [
            StorysidebarComponent,
            NodeUidDisplayPipe,
            NodeExternalUrlPipe,
            PropertyDisplayPipe
        ]
    }).compileComponents();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(StorysidebarComponent);
    component = fixture.componentInstance;
    component.sidebarOpen = true;
    component.node = bug;
    fixture.detectChanges();
    tick();
  }));

  it('should display the input node when the sidebar is open', fakeAsync(() => {
    const titleAnchorEl = fixture.debugElement.query(By.css('#sidebar a[target="_blank"]')).nativeElement;
    expect(titleAnchorEl.href).toBe('https://bugzilla.redhat.com/show_bug.cgi?id=23456');
    const titleEl = fixture.debugElement.query(By.css('#sidebar > a > h3')).nativeElement;
    expect(titleEl.textContent).toBe('RHBZ#23456');
    const sidebarPropertiesEl = fixture.debugElement.query(By.css('#sidebarProperties')).nativeElement;
    expect(sidebarPropertiesEl.children.length).toBe(20);
    expect(sidebarPropertiesEl.children[0].children[0].textContent).toBe('Assignee:');
    expect(sidebarPropertiesEl.children[0].children[1].textContent).toBe('user1');
    expect(sidebarPropertiesEl.children[1].children[0].textContent).toBe('Attached Advisories:');
    expect(sidebarPropertiesEl.children[1].children[1].textContent).toBe('1');
    expect(sidebarPropertiesEl.children[2].children[0].textContent).toBe('Classification:');
    expect(sidebarPropertiesEl.children[2].children[1].textContent).toBe('Red Hat');
    expect(sidebarPropertiesEl.children[3].children[0].textContent).toBe('Creation Time:');
    expect(sidebarPropertiesEl.children[3].children[1].textContent).toBe('March 5, 2018, 20:29:03 UTC');
    expect(sidebarPropertiesEl.children[4].children[0].textContent).toBe('ID:');
    expect(sidebarPropertiesEl.children[4].children[1].textContent).toBe('23456');
    expect(sidebarPropertiesEl.children[5].children[0].textContent).toBe('Modified Time:');
    expect(sidebarPropertiesEl.children[5].children[1].textContent).toBe('March 26, 2018, 15:53:52 UTC');
    expect(sidebarPropertiesEl.children[6].children[0].textContent).toBe('Priority:');
    expect(sidebarPropertiesEl.children[6].children[1].textContent).toBe('high');
    expect(sidebarPropertiesEl.children[7].children[0].textContent).toBe('Product Name:');
    expect(sidebarPropertiesEl.children[7].children[1].textContent).toBe('Red Hat Enterprise Linux 7');
    expect(sidebarPropertiesEl.children[8].children[0].textContent).toBe('Product Version:');
    expect(sidebarPropertiesEl.children[8].children[1].textContent).toBe('7.4');
    expect(sidebarPropertiesEl.children[9].children[0].textContent).toBe('QA Contact:');
    expect(sidebarPropertiesEl.children[9].children[1].textContent).toBe('user2');
    expect(sidebarPropertiesEl.children[10].children[0].textContent).toBe('Related By Commits:');
    expect(sidebarPropertiesEl.children[10].children[1].textContent).toBe('0');
    expect(sidebarPropertiesEl.children[11].children[0].textContent).toBe('Reporter:');
    expect(sidebarPropertiesEl.children[11].children[1].textContent).toBe('user3');
    expect(sidebarPropertiesEl.children[12].children[0].textContent).toBe('Resolution:');
    expect(sidebarPropertiesEl.children[12].children[1].textContent).toBe('ERRATA');
    expect(sidebarPropertiesEl.children[13].children[0].textContent).toBe('Resolved By Commits:');
    expect(sidebarPropertiesEl.children[13].children[1].textContent).toBe('1');
    expect(sidebarPropertiesEl.children[14].children[0].textContent).toBe('Reverted By Commits:');
    expect(sidebarPropertiesEl.children[14].children[1].textContent).toBe('0');
    expect(sidebarPropertiesEl.children[15].children[0].textContent).toBe('Severity:');
    expect(sidebarPropertiesEl.children[15].children[1].textContent).toBe('high');
    expect(sidebarPropertiesEl.children[16].children[0].textContent).toBe('Short Description:');
    expect(sidebarPropertiesEl.children[16].children[1].textContent).toBe('Some description');
    expect(sidebarPropertiesEl.children[17].children[0].textContent).toBe('Status:');
    expect(sidebarPropertiesEl.children[17].children[1].textContent).toBe('CLOSED');
    expect(sidebarPropertiesEl.children[18].children[0].textContent).toBe('Target Milestone:');
    expect(sidebarPropertiesEl.children[18].children[1].textContent).toBe('rc');
    expect(sidebarPropertiesEl.children[19].children[0].textContent).toBe('Votes:');
    expect(sidebarPropertiesEl.children[19].children[1].textContent).toBe('0');
  }));

  it('should not display the input node when the sidebar is closed', fakeAsync(() => {
    component.sidebarOpen = false;
    fixture.detectChanges();
    tick();

    const titleAnchorEl = fixture.debugElement.query(By.css('#sidebar a[target="_blank"]'));
    expect(titleAnchorEl).toBeNull();
    const titleEl = fixture.debugElement.query(By.css('#sidebar > a > h3'));
    expect(titleEl).toBeNull();
    const sidebarPropertiesEl = fixture.debugElement.query(By.css('#sidebarProperties'));
    expect(sidebarPropertiesEl).toBeNull();
  }));
});
