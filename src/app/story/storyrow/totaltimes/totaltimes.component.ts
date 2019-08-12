import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-totaltimes',
  templateUrl: './totaltimes.component.html',
  styleUrls: ['./totaltimes.component.css']
})
export class TotalTimesComponent {
  @Input() totalLeadTime: number;
  @Input() totalProcessingTime: number;
  @Input() totalWaitTime: number;
}
