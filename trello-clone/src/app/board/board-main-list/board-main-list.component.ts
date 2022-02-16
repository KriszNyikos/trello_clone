import { Component, OnInit, Input } from '@angular/core';
import { BoardStoreService, List, Todo } from 'src/app/board-store.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { NewTodoDialogComponent } from './new-todo-dialog/new-todo-dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-board-main-list',
  templateUrl: './board-main-list.component.html',
  styleUrls: ['./board-main-list.component.css'],
})
export class BoardMainListComponent implements OnInit {
  @Input() public listId: number | null = null;
  uniqId: string = '';
  public list: List | undefined = undefined;
  public todoList: Todo[] = [];
  constructor(
    public store: BoardStoreService,
    public dialog: MatDialog,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.store.fetchItems('lists');
    this.setLists();
  }

  setLists() {
    this.store.lists.subscribe((lists: List[]) => {
      this.list = lists.find((list) => list.id === this.listId);

      this.uniqId = this.list
        ? `${this.list.name}-${this.list.id}`.split(' ').join('')
        : '';
    });
  }

  deleteList() {
    this.store.deleteListById(this.listId!);
  }

  drop(event: CdkDragDrop<any[]>) {
    let { previousContainer, container, previousIndex, currentIndex } = event;
    let todoId = event.item.element.nativeElement.id;

    this.store.dragNDropTodo(
      previousIndex,
      currentIndex,
      previousContainer.element.nativeElement.id,
      container.element.nativeElement.id,
      todoId
    );
  }

  openNewTodoDialog() {
    const dialogRef = this.dialog.open(NewTodoDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      let { name, description } = result;

      this.store.addNewTodo(name, description, this.listId!);
    });
  }
}
