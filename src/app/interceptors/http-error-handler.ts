import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

/**
 * An HTTP interceptor that displays a toast notification for any API errors
 */
@Injectable()
export class HTTPErrorHandler implements HttpInterceptor {

  readonly apiUrl: string = environment.api;

  constructor(private notification: ToastrService) { }

  /**
   * Intercept the HTTP request and display a toast notification on API errors
   * @param request the HTTP request to process
   * @param next the HTTP handler
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.startsWith(this.apiUrl)) {
      // If the request is to the Estuary API, then display a toast notification with the error
      return next.handle(request).pipe(tap(
        () => {},
        (error) => { this.displayError(error); }
      ));
    } else {
      // If the request is not for the API, then just return it as is
      return next.handle(request);
    }
  }

  /**
   * Parse the error message and display a toast notification of the error
   * @param error the error to display
   */
  displayError(error: HttpErrorResponse) {
    let errorDisplayMsg: string;
    if (error.error instanceof ErrorEvent) {
      // Communication with the backend failed
      errorDisplayMsg = 'The API server could not be reached. Please try again.';
    } else {
      // This means the backend returned an unsuccessful response code.
      // Since we know the backend will be returning JSON with the message key
      // set, this can be directly displayed to the user.
      errorDisplayMsg = error.error.message;
    }

    this.notification.error(errorDisplayMsg);
  }
}
