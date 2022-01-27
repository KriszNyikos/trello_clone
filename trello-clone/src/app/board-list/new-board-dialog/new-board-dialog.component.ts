import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-new-board-dialog',
  templateUrl: './new-board-dialog.component.html',
  styleUrls: ['./new-board-dialog.component.css']
})
export class NewBoardDialogComponent implements OnInit {

  constructor(public dialog: MatDialog,  public dialogRef: MatDialogRef<NewBoardDialogComponent>,) { }


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
