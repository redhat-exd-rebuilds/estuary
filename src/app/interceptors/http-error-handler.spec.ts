import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { NotificationService } from '../services/notification.service';
import { Notification } from '../models/notification.type';
import { HTTPErrorHandler } from './http-error-handler';


describe(`AuthHttpInterceptor`, () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HTTPErrorHandler,
          multi: true,
        },
        NotificationService
      ],
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    notificationService = TestBed.get(NotificationService);
  });

  it('should send a notification if there is an error', (done) => {
    // Subscribe to the notification service so that we can verify that the
    // HTTPErrorHandler interceptor was called
    notificationService.notifications.subscribe(
      (notification: Notification) => {
        // Verify that HTTPErrorHandler actually sent an error
        expect(notification.msg).toBe('some error');
        expect(notification.msgType).toBe('danger');
        done();
      }
    );
    // Start an HTTP request
    httpClient.get(environment.api).subscribe(
      () => {},
      () => {}
    );
    const req = httpTestingController.expectOne(environment.api);
    // End the request with a 400 error
    req.flush({'message': 'some error'}, { status: 400, statusText: 'Bad Request' });
    httpTestingController.verify();
  });
});
