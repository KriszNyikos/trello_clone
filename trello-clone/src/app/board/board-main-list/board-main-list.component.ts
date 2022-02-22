import { Component, OnInit, Input } from '@angular/core';
import { BoardStoreService, List, Todo } from 'src/app/board-store.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { NewTodoDialogComponent } from './new-todo-dialog/new-todo-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { NewListDialogComponent } from '../board-main/new-list-dialog/new-list-dialog.component';

@Component({
  selector: 'app-board-main-list',
  templateUrl: './board-main-list.component.html',
  styleUrls: ['./board-main-list.component.css'],
})
export class BoardMainListComponent implements OnInit {
  @Input() public inputList: any | undefined = undefined;
  uniqId: string = '';
  public list: any | undefined
  public todoList: Todo[] = [];
  constructor(
    public store: BoardStoreService,
    public dialog: MatDialog,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
   this.list = this.inputList
   this.uniqId = this.inputList.id
  }


  deleteList() {
    this.store.deleteList(this.list)
  }

  drop(event: CdkDragDrop<any[]>) {
    let { previousContainer, container, previousIndex, currentIndex } = event;
    let todoId = event.item.element.nativeElement.id;

    console.log('DragNDrop todo', previousIndex, currentIndex,)

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

      this.store.addNewTodo(name, description, this.list.id);
    });
  }

  modifyListDialog(list: List) {

    console.log('Modify', list)
    
    let dialogRef = this.dialog.open(NewListDialogComponent, {data: {list}});
    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        this.store.modifyList(result, list);
      }
     
    });
  }
}
