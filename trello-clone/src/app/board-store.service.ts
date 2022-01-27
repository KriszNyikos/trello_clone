import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BoardListMainComponent } from './board-list/board-list-main/board-list-main.component';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root'
})
export class BoardStoreService {
private $boardList: BehaviorSubject<Board[]> = new BehaviorSubject([] as Board[]) 



  constructor() { }

  fetchBoardList(){

    let boards = localStorage.getItem('boards')

    if(boards){
      this.$boardList.next((JSON.parse(boards) as Board[]))
    }

  }

  get boardList(){
    return this.$boardList.asObservable()
  }

  deleteBoard(id: number){
    let list = localStorage.getItem('boards') ? JSON.parse(localStorage.getItem('boards')!) : undefined

    console.log('Before', list)

    if(list){
     list = list.filter((board: Board)=>{
        return board.id !== id
      })
    }

    console.log('After', list)

    this.setBoardsList(list)
    this.fetchBoardList()
  }


  setInitialBoardList(){
    localStorage.getItem('boards') ? undefined : this.setBoardsList(initialBoards)
    
  }



  setBoardsList(boardList: Board[]){
    localStorage.setItem('boards', JSON.stringify(boardList)) 
  }

  getBoardList(){
    return localStorage.getItem('boards') ? JSON.parse(localStorage.getItem('boards')!) : undefined
  }

  dragNDropBoard(previousIndex: number, currentIndex: number){
    let list = localStorage.getItem('boards') ? JSON.parse(localStorage.getItem('boards')!) : undefined

    if(list){
      moveItemInArray(list, previousIndex, currentIndex);
    }

    this.setBoardsList(list)
    this.fetchBoardList()

  }

  createNewBoard(name: string, description: string){
    let list = this.getBoardList()
    let board: Board = {id: this.createUniqueId(list), name, items : [], description,  status: "pending", created: new Date(), }
    return board
  }

  addNewBoard(name: string, description: string){
    let list = this.getBoardList()
    let newBoard = this.createNewBoard(name, description)
    list.push(newBoard)
    this.setBoardsList(list)
    this.fetchBoardList()
  }

  createUniqueId(list: Board[]){
    let id = list[list.length - 1].id

    let ids = list.map(board =>board.id)
    return ids.sort()[ids.length -1] !== id ? id : id +1

  }
}


let initialBoards: Board[] = [
  {id: 1, name: 'Test board1', items:[], status: 'inProgress', description: 'Lorem ipsum', created: new Date('2021-01-15')},
  {id: 2, name: 'Test board2', items:[], status: 'inProgress', description: 'Lorem ipsum', created: new Date('2021-02-15')},
  {id: 3, name: 'Test board3', items:[], status: 'inProgress', description: 'Lorem ipsum', created: new Date('2021-03-15')},
  {id: 4, name: 'Test board4', items:[], status: 'inProgress', description: 'Lorem ipsum', created: new Date('2021-01-15')},
]

export interface Board{
  id: number
  items : BoardItem[]
  status : 'ready' | 'inProgress' | 'failed' | 'pending'
  name: String
  description: String
  created: Date
}

export interface BoardItem{

}