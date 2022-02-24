import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveToDialogzComponent } from './move-to-dialogz.component';

describe('MoveToDialogzComponent', () => {
  let component: MoveToDialogzComponent;
  let fixture: ComponentFixture<MoveToDialogzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveToDialogzComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveToDialogzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
