import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFileComponent } from './manage-file.component';

describe('ManageFileComponent', () => {
  let component: ManageFileComponent;
  let fixture: ComponentFixture<ManageFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
