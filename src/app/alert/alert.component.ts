import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {trigger, transition, style, animate, state} from '@angular/animations';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  animations: [
    trigger('easeInOut', [
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
export class AlertComponent {

  @Input() errorMsg: String;
  constructor() { }

}
