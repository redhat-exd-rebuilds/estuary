import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ToastrService, ToastrModule } from 'ngx-toastr';

import { environment } from '../../environments/environment';
import { HTTPErrorHandler } from './http-error-handler';


describe(`AuthHttpInterceptor`, () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  let notification: ToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot({}),
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HTTPErrorHandler,
          multi: true,
        },
      ],
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    notification = TestBed.get(ToastrService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should send a notification if there is an error', () => {
    const mockNotificationError = spyOn(notification, 'error');
    // Start an HTTP request
    httpClient.get(environment.api).subscribe(
      () => {},
      () => {}
    );
    const req = httpTestingController.expectOne(environment.api);
    // End the request with a 400 error
    req.flush({'message': 'some error'}, { status: 400, statusText: 'Bad Request' });
    // Verify that the toast notification would have been displayed
    expect(mockNotificationError).toHaveBeenCalledTimes(1);
    expect(mockNotificationError).toHaveBeenCalledWith('some error');
  });
});
