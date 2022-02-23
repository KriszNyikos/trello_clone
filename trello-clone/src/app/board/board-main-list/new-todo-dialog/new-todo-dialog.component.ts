import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog ,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Todo } from 'src/app/board-store.service';


@Component({
  selector: 'app-new-todo-dialog',
  templateUrl: './new-todo-dialog.component.html',
  styleUrls: ['./new-todo-dialog.component.css']
})
export class NewTodoDialogComponent{

  constructor(public dialog: MatDialog,  public dialogRef: MatDialogRef<NewTodoDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  public fields = {
    name: this.data.todo.name || '',
    description: this.data.todo.description || '',
    modify : this.data.modify || false
  }

  closeWithResult(){
    this.dialogRef.close(this.fields)
  }


}
