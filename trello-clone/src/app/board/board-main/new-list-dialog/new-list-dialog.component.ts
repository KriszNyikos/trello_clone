import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { List } from 'src/app/board-store.service';

@Component({
  selector: 'app-new-list-dialog',
  templateUrl: './new-list-dialog.component.html',
  styleUrls: ['./new-list-dialog.component.css']
})
export class NewListDialogComponent implements OnInit {

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<NewListDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: {list: List}) { }

  public name = this.data.list.name || ""

  ngOnInit(): void {
  }

  closeWithResult(){
    this.dialogRef.close(this.name)
  }

}
