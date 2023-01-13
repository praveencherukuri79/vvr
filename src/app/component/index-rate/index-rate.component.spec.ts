import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexRateComponent } from './index-rate.component';

describe('IndexRateComponent', () => {
  let component: IndexRateComponent;
  let fixture: ComponentFixture<IndexRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexRateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
