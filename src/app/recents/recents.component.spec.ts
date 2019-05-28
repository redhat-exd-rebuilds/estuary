import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { RecentsComponent } from './recents.component';

describe('RecentsComponent', () => {
  let component: RecentsComponent;
  let fixture: ComponentFixture<RecentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentsComponent ],
      imports: [
        TabsModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
