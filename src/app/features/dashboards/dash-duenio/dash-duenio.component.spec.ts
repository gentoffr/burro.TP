import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashDuenioComponent } from './dash-duenio.component';

describe('DashDuenioComponent', () => {
  let component: DashDuenioComponent;
  let fixture: ComponentFixture<DashDuenioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DashDuenioComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DashDuenioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
