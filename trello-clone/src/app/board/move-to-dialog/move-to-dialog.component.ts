import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Todo, List, Board } from 'src/app/board-store.service';
import { BoardStoreService } from 'src/app/board-store.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-move-to-dialog',
  templateUrl: './move-to-dialog.component.html',
  styleUrls: ['./move-to-dialog.component.css'],
})
export class MoveToDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { todo: Todo; type: 'toList' | 'toBoard' | undefined },
    public dialog: MatDialog,
    private store: BoardStoreService,
    public route: ActivatedRoute
  ) {}
  public lists: List[] = [];
  public selected: number | null = null;
  public todo: Todo = {} as Todo;
  public type: 'toList' | 'toBoard' | undefined = undefined;

  public toListFields: { selectedListId: number | null; lists: List[] } = {
    selectedListId: null,
    lists: [],
  };

  public toBoardFields: {
    selectedBoardId: number | null;
    selectedListId: number | null;
    boards: Board[];
    lists: List[];
  } = {
    selectedBoardId: null,
    selectedListId: null,
    boards: [],
    lists: [],
  };

  ngOnInit(): void {
    this.todo = this.data.todo;
    this.type = this.data.type;
    this.lists = this.store
      .getConnectedLists(this.data.todo.listId)
      .filter((l: List) => l.id !== this.data.todo.listId);

    switch (this.data.type) {

      case 'toList': {
        this.toListFields.lists = this.store
          .getConnectedLists(this.data.todo.listId)
          .filter((l: List) => l.id !== this.data.todo.listId);
        break;
      }

      case 'toBoard': {
        let filteredBoards = this.store.getBoards().reduce((acc: Board[],b: Board)=>{
          let listIds = b.lists.map(l => l.id)

          if(!listIds.includes(this.todo.listId)){
            acc = [...acc, b]
          }

          return acc
        },[])

        this.toBoardFields.boards = filteredBoards
        break;
      }
    }
  }

  moveTodoToList() {
    
    let { listId, order } = this.todo;

    if (this.toListFields.selectedListId) {
      this.store.moveTodosToOtherList(
        this.toListFields.selectedListId.toString(),
        listId.toString(),
        order,
        this.lists.length - 1
      )
      this.dialog.closeAll();
    }
  }

  changeListOfBoards() {
    this.toBoardFields.selectedListId = null;
    this.toBoardFields.lists = [];
    let { boards, selectedBoardId } = this.toBoardFields;
    this.toBoardFields.lists = boards.find(
      (b) => b.id === selectedBoardId
    )!.lists;
  }

  moveTodOtherBoard() {
    this.store.moveTodoToOtherBoard(this.todo, this.toBoardFields.selectedListId!)
    this.dialog.closeAll()
  }
}
