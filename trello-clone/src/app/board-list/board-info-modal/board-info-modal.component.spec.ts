import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardInfoModalComponent } from './board-info-modal.component';

describe('BoardInfoModalComponent', () => {
  let component: BoardInfoModalComponent;
  let fixture: ComponentFixture<BoardInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardInfoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
