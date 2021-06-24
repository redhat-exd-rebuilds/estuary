import { ComponentFixture, TestBed, tick, fakeAsync, waitForAsync } from '@angular/core/testing';
import { ModalModule } from 'ngx-bootstrap/modal';
import { By } from '@angular/platform-browser';

import { TruncateModalComponent } from './truncate-modal.component';
import { TruncatePipe } from '../../pipes/nodedisplay';


describe('TruncateModalComponent', () => {
  let component: TruncateModalComponent;
  let fixture: ComponentFixture<TruncateModalComponent>;
  const summary = 'CVE-2018-1235 kernel: some really long error that is hard to ' +
                  'fix and causes problems [rhel-7.5.z]';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TruncateModalComponent, TruncatePipe ],
      imports: [ ModalModule.forRoot() ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruncateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display a link that opens a modal', fakeAsync(() => {
    component.column = 'Short Description';
    component.value = summary;
    component.preformatted = false;
    fixture.detectChanges();
    const modalLink = fixture.debugElement.query(By.css('.modal-link')).nativeElement;
    // The "Short Description" column is too long, so it gets truncated and becomes a link
    // that activates a modal
    expect(modalLink.textContent.trim()).toBe('CVE-2018-1235 kernel: some really long error that …');
    expect(modalLink.tagName).toBe('A');

    // Click the modal and check to make sure it displays
    modalLink.click();
    // Tick one second for the modal to appear
    tick(1000);
    // We must use document.querySelector instead of using the fixture because
    // ngx-bootstrap displays the modal outside of the component
    const modalHeader = document.querySelector('.modal-title');
    expect(modalHeader.textContent.trim()).toBe('Short Description');
    const modalBody = document.querySelector('.modal-body');
    expect(modalBody.textContent.trim()).toBe(summary);
    // Make sure the "pre" tag is not present since `component.preformatted` is false
    expect(modalBody.children.length).toBe(0);
    const closeBtn: HTMLElement = document.querySelector('button.close');
    closeBtn.click();
    // Tick one second for the modal to close
    tick(1000);
  }));

  it('should display a modal with pre tags', fakeAsync(() => {
    component.column = 'Short Description';
    component.value = summary;
    component.preformatted = true;
    fixture.detectChanges();
    const modalLink = fixture.debugElement.query(By.css('.modal-link')).nativeElement;

    // Click the modal and check to make sure it displays
    modalLink.click();
    // Tick one second for the modal to appear
    tick(1000);
    // We must use document.querySelector instead of using the fixture because
    // ngx-bootstrap displays the modal outside of the component
    const pre = document.querySelector('pre');
    expect(pre.textContent.trim()).toBe(summary);
    const closeBtn: HTMLElement = document.querySelector('button.close');
    closeBtn.click();
    // Tick one second for the modal to close
    tick(1000);
  }));
});
