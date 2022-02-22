import { Component, OnInit } from '@angular/core';
import { BoardStoreService, Board } from 'src/app/board-store.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { NewBoardDialogComponent } from '../new-board-dialog/new-board-dialog.component';
import { mergeMap, Observable, pipe } from 'rxjs';


@Component({
  selector: 'app-board-list-main',
  templateUrl: './board-list-main.component.html',
  styleUrls: ['./board-list-main.component.css'],
})
export class BoardListMainComponent implements OnInit {
  constructor(public store: BoardStoreService, public dialog: MatDialog) {}

  boards: any[] | undefined = undefined;

  ngOnInit(): void {
    this.store.boards.subscribe((boards: any)=> this.boards = boards);
  }



  deleteBoard(board: any) {


    this.store.deleteBoard(board)

  }

  drop(event: CdkDragDrop<Board[]>) {
    if (this.boards) {
      this.store.dragNDropBoard(event.previousIndex, event.currentIndex);
    }
  }

  newBoard() {
    const dialogRef = this.dialog.open(NewBoardDialogComponent, {
      width: '50vw', data: {edit: false}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let { name, description } = result;
        this.store.addNewBoard(name, description);
      }
    });
  }
}
