import { Component, OnInit } from '@angular/core';
import { MatDialog ,MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-todo-dialog',
  templateUrl: './new-todo-dialog.component.html',
  styleUrls: ['./new-todo-dialog.component.css']
})
export class NewTodoDialogComponent implements OnInit {

  constructor(public dialog: MatDialog,  public dialogRef: MatDialogRef<NewTodoDialogComponent>,) { }

  public fields = {
    name: '',
    description: ''
  }

  closeWithResult(){
    this.dialogRef.close(this.fields)
  }
  ngOnInit(): void {
  }

}
