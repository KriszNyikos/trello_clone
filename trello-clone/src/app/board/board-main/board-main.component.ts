import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardStoreService, Board, List, Todo } from 'src/app/board-store.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-board-main',
  templateUrl: './board-main.component.html',
  styleUrls: ['./board-main.component.css']
})
export class BoardMainComponent implements OnInit {

  constructor(private route: ActivatedRoute, public store: BoardStoreService) { }

  board: Board | undefined = undefined
  lists: List[] = []
  todos: Todo[] =[]

  ngOnInit(): void {

    this.route.params.subscribe((params)=>{
      let {id} = params

      this.store.fetchBoards()
      this.store.fetchLists()
      this.store.fetchTodos()
      this.setBoard(id)
      this.setLists(id)
    })


  }

  setBoard(id: number){
    this.store.boards.subscribe((boards: Board[]) => {
      let selectedBrd = boards.find((brd: Board) => brd.id == id)
        this.board = selectedBrd ? selectedBrd : undefined
    });
  }

  setLists(id: number){
    this.store.lists.subscribe((lists: List[]) => {
      this.lists = lists.filter(ls =>{
        return ls.boardId == id
      })
    })
  }


  
  setTodos(id: number){
    this.store.boards.subscribe((boards: Board[]) => {
      let selectedBrd = boards.find((brd: Board) => brd.id == id)
        this.board = selectedBrd ? selectedBrd : undefined
    });
  }

  drop(event: CdkDragDrop<List[]>) {
    this.store.dragNDropList(event.previousIndex, event.currentIndex, this.board!.id)
  }


}
