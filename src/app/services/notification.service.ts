import { Injectable } from '@angular/core';
import { Notification } from '../models/notification.type';
import { Subject } from 'rxjs';

/**
 * A service that manages the subscription of notifications. This is currently used
 * for the NotificationComponent to know when to display a notification.
 */
@Injectable({providedIn: 'root'})
export class NotificationService {

  /**
   * The subject that is used to stream notifications to the observers.
   * This is not used directly. The subscriber actually uses the notifications property.
   */
  private subject = new Subject<Notification>();
  /**
   * The notification stream as an observable for read-only consumption
   */
  notifications = this.subject.asObservable();

  /**
   * Send a new notification on the subject stream
   * @param msg the message to display
   * @param msgType the Patternfly toast notification message type (e.g. 'danger')
   */
  display(msg: string, msgType: string) {
    this.subject.next(<Notification>{ msg, msgType });
  }

  /**
   * Close the toast notification by sending a null message
   */
  close() {
    this.subject.next(<Notification>{ msg: null, msgType: null });
  }
}
