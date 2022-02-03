import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTodoDialogComponent } from './new-todo-dialog.component';

describe('NewTodoDialogComponent', () => {
  let component: NewTodoDialogComponent;
  let fixture: ComponentFixture<NewTodoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTodoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTodoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
