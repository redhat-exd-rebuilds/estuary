import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';

import { SpinnerComponent } from './spinner.component';


describe('SpinnerComponent testing', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [SpinnerComponent],
        imports: [NoopAnimationsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
  });

  it('should be visible when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();
    expect(component.loading).toBe(true);
    const overlayEl = fixture.debugElement.query(By.css('.overlay-container')).nativeElement;
    expect(overlayEl).toBeTruthy();
    const spinnerEl = fixture.debugElement.query(By.css('.overlay-container__spinner')).nativeElement;
    expect(spinnerEl).toBeTruthy();
  });

  it('should not be visible when loading is false (default)', () => {
    expect(component.loading).toBe(false);
    const overlay = fixture.debugElement.query(By.css('.overlay-container'));
    expect(overlay).toBeNull();
    const spinner = fixture.debugElement.query(By.css('.overlay-container__spinner'));
    expect(spinner).toBeNull();
  });
});
