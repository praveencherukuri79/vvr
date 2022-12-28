import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminErrorComponent } from './admin-error.component';

describe('AdminErrorComponent', () => {
  let component: AdminErrorComponent;
  let fixture: ComponentFixture<AdminErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminErrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
