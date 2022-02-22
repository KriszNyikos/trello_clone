import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BoardStoreService,
  Board,
  List,
  Todo,
} from 'src/app/board-store.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { NewListDialogComponent } from './new-list-dialog/new-list-dialog.component';

@Component({
  selector: 'app-board-main',
  templateUrl: './board-main.component.html',
  styleUrls: ['./board-main.component.css'],
})
export class BoardMainComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    public store: BoardStoreService,
    public dialog: MatDialog
  ) {}

  board: any | undefined = undefined;
  lists: List[] = [];
  todos: Todo[] = [];

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      let boardId = parseInt(params['id'])
      this.newSetBoard(boardId)
    });
  }

  newSetBoard(boardID: number){

    this.store.boards.subscribe((boards: any[] ) =>{
      this.board = boards.find((board: any)=> board.id === boardID)
    })
  }

  setBoard(id: number) {
    this.store.boards.subscribe((boards: Board[]) => {
      let selectedBrd = boards.find((brd: Board) => brd.id === id);
      this.board = selectedBrd ? selectedBrd : undefined;
    });
  }


  setTodos(id: number) {
    this.store.boards.subscribe((boards: Board[]) => {
      let selectedBrd = boards.find((brd: Board) => brd.id == id);
      this.board = selectedBrd ? selectedBrd : undefined;
    });
  }

  drop(event: CdkDragDrop<List[]>) {

    console.log('Dragndroplist', event)
    this.store.dragNDropList(
      event.previousIndex,
      event.currentIndex,
      this.board?.id
    );
  }

  addNewListDialog() {
    
    let dialogRef = this.dialog.open(NewListDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        this.store.addNewList(result, this.board);
      }
     
    });
  }

}
