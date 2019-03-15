import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

import { NotificationService } from '../services/notification.service';
import { Notification } from '../models/notification.type';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  animations: [
    trigger('slideInEaseOut', [
      transition(':enter', [
        style({
          right: '-100%',
          overflow: 'hidden'
        }),
        animate('.3s ease', style({right: '*'}))
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('0.25s ease-in-out', style({opacity: 0}))
      ])
    ])
  ]
})
export class NotificationComponent implements OnInit, OnDestroy {

  /**
   * The message to display in the toast notification
   */
  msg: string;
  /**
   * The Patternfly toast notification message type (e.g. 'danger')
   */
  msgType: string;
  private subscription: Subscription;

  constructor(private notification: NotificationService, private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(
      () => {
        // Close any notifications if they exist when the route changes
        this.notification.close();
      }
    );
  }

  /**
   * Initialize the component by subscribing to the notifications observable
   */
  ngOnInit() {
    this.subscription = this.notification.notifications
      .subscribe((notification: Notification) => {
        this.msg = notification.msg;
        this.msgType = notification.msgType;
      });
  }

  /**
   * Unsubscribe from the notifications observable when the component is destroyed
   */
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
