import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
  animations: [
    trigger('easeOut', [
      transition(':leave', [
        style({opacity: 1}),
        animate('0.5s ease-in-out', style({opacity: 0}))
      ])
    ])
  ]
})
export class SpinnerComponent {

  @Input() loading: boolean;
}
