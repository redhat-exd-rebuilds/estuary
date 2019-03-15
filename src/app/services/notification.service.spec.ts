import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import { Notification } from '../models/notification.type';


describe('NotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', (done) => {
    const service: NotificationService = TestBed.get(NotificationService);
    let counter = 0;
    service.notifications.subscribe(
      (notification: Notification) => {
        counter += 1;
        if (counter === 1) {
          // Testing the display method
          expect(notification.msg).toBe('test message');
          expect(notification.msgType).toBe('danger');
        } else if (counter === 2) {
          // Testing the close method
          expect(notification.msg).toBeNull();
          expect(notification.msgType).toBeNull();
          // Finish the test
          done();
        }
      }
    );
    service.display('test message', 'danger');
    service.close();
  });
});
