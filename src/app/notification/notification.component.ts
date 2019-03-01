import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

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
export class NotificationComponent {

  @Output() errorMsgChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() errorMsg: string;

  constructor() { }

  resetErrorMsg() {
    this.errorMsg = '';
    this.errorMsgChange.emit(this.errorMsg);
  }
}
