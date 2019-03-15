import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastNotificationModule } from 'patternfly-ng/notification';

import { NotificationComponent } from '../notification/notification.component';
import { NotificationService } from '../services/notification.service';


describe('NotificationComponent testing', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [NotificationComponent],
        imports: [ToastNotificationModule, RouterTestingModule, NoopAnimationsModule],
        providers: [NotificationService]
    }).compileComponents();
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
  });

  it('displays a notification', fakeAsync(() => {
    // Execute ngOnInit
    fixture.detectChanges();
    tick();
    // Check that notification is not currently displayed
    expect(fixture.debugElement.query(By.css('.toast-pf'))).toBeNull();
    // Send a notification
    const service: NotificationService = TestBed.get(NotificationService);
    service.display('some error', 'danger');
    // Have the component notice a notification was sent
    fixture.detectChanges();
    tick();
    // Check to see if the notification is present
    const notificationEl = fixture.debugElement.query(By.css('.toast-pf')).nativeElement;
    expect(notificationEl.innerText).toBe('some error');
    expect(notificationEl.classList).toContain('alert-danger');
    // Close the notification
    const closeBtn = fixture.debugElement.query(By.css('button.close')).nativeElement;
    closeBtn.click();
    fixture.detectChanges();
    tick();
    // Check that notification is not currently displayed
    expect(fixture.debugElement.query(By.css('.toast-pf'))).toBeNull();
  }));
});
