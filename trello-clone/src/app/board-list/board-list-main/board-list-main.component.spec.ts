import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardListMainComponent } from './board-list-main.component';

describe('BoardListMainComponent', () => {
  let component: BoardListMainComponent;
  let fixture: ComponentFixture<BoardListMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardListMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardListMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
