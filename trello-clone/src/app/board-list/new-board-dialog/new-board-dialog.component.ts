import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Board } from 'src/app/board-store.service';

@Component({
  selector: 'app-new-board-dialog',
  templateUrl: './new-board-dialog.component.html',
  styleUrls: ['./new-board-dialog.component.css'],
})
export class NewBoardDialogComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<NewBoardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {edit: boolean, board: Board}
  ) {}

  public fields = {
    name: this.data.edit ?  this.data.board.name || '' : '',
    description: this.data.edit ?  this.data.board.description || '' : '',
  };

  closeWithResult() {
    this.dialogRef.close(this.fields);
  }

  ngOnInit(): void{
  }
}
