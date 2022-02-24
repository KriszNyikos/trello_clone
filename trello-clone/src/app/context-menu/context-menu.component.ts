import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardStoreService, Todo } from '../board-store.service';
import { NewTodoDialogComponent } from '../board/board-main-list/new-todo-dialog/new-todo-dialog.component';
import { MoveToDialogComponent } from '../board/move-to-dialog/move-to-dialog.component';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ContextMenuComponent implements OnInit{

  constructor(public store: BoardStoreService, @Inject(MAT_DIALOG_DATA) public data: Todo, public dialog: MatDialog) { }
  public isOpen: boolean = false


  ngOnInit(): void {
  }

  deleteTodo(event: any){
    event.stopPropagation()
    this.store.deleteTodo(this.data)
    this.dialog.closeAll()
  }


  //Subsciption type 
  modifyTodo(event: any){
    event.stopPropagation()
    this.dialog.open(NewTodoDialogComponent, {data: {todo: this.data, modify: true}})
    .afterClosed().subscribe((res)=>{
      this.store.modifyTodo(res, this.data)
      this.dialog.closeAll()
    })
  }

  moveToList(event: any){
    event.stopPropagation()
    this.dialog.open(MoveToDialogComponent)
  }

  moveToBoard(event: any){

  }

}
