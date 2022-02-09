import { Component, OnInit } from '@angular/core';
import { BoardStoreService, Board } from 'src/app/board-store.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { NewBoardDialogComponent } from '../new-board-dialog/new-board-dialog.component';

@Component({
  selector: 'app-board-list-main',
  templateUrl: './board-list-main.component.html',
  styleUrls: ['./board-list-main.component.css'],
})
export class BoardListMainComponent implements OnInit {
  constructor(public store: BoardStoreService, public dialog: MatDialog) {}

  boards: Board[] | undefined = undefined;

  ngOnInit(): void {
    this.store.fetchItems('boards');

    this.store.boards.subscribe((boards: Board[]) => {
      this.setBoardList(boards);
    });
  }

  setBoardList(list: Board[]) {
    this.boards = list;
  }

  deleteBoard(id: number) {
    this.store.deleteBoard(id);
  }

  drop(event: CdkDragDrop<Board[]>) {
    if (this.boards) {
      this.store.dragNDropBoard(event.previousIndex, event.currentIndex);
    }
  }

  newBoard() {
    const dialogRef = this.dialog.open(NewBoardDialogComponent, {
      width: '50vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let { name, description } = result;
        this.store.addNewBoard(name, description);
      }
    });
  }
}
