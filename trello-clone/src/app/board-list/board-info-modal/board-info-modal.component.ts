import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Board } from 'src/app/board-store.service';

@Component({
  selector: 'app-board-info-modal',
  templateUrl: './board-info-modal.component.html',
  styleUrls: ['./board-info-modal.component.css']
})
export class BoardInfoModalComponent implements OnInit {
  
  constructor(public dialogRef: MatDialogRef<BoardInfoModalComponent>, @Inject(MAT_DIALOG_DATA) public data: Board) { }

  ngOnInit(): void {}

}
