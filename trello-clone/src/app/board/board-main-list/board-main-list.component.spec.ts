import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardMainListComponent } from './board-main-list.component';

describe('BoardMainListComponent', () => {
  let component: BoardMainListComponent;
  let fixture: ComponentFixture<BoardMainListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardMainListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardMainListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
