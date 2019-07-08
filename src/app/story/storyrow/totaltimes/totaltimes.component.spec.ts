import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TotalTimesComponent } from './totaltimes.component';
import { TimeDisplayPipe } from '../../../pipes/timedisplay';


describe('TotalTimesComponent', () => {
  let fixture: ComponentFixture<TotalTimesComponent>;
  let component: TotalTimesComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TotalTimesComponent,
        TimeDisplayPipe,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TotalTimesComponent);
    component = fixture.componentInstance;
  });

  it('should display the 3 timeline statistics', fakeAsync(() => {
    component.totalLeadTime = 86400;
    component.totalProcessingTime = 3600;
    component.totalWaitTime = 20;
    fixture.detectChanges();
    const totalTimesEl = fixture.debugElement.queryAll(By.css('.timeline-properties__row__data'));
    expect(totalTimesEl[0].nativeElement.textContent).toBe('Total lead time:');
    expect(totalTimesEl[1].nativeElement.textContent).toBe('1 days, 0 hours, 0 minutes');
    expect(totalTimesEl[2].nativeElement.textContent).toBe('Total processing time:');
    expect(totalTimesEl[3].nativeElement.textContent).toBe('1 hours, 0 minutes, 0 seconds');
    expect(totalTimesEl[4].nativeElement.textContent).toBe('Total wait time:');
    expect(totalTimesEl[5].nativeElement.textContent).toBe('20 seconds');
  }));
});
