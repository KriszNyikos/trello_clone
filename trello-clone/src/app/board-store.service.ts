import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BoardListMainComponent } from './board-list/board-list-main/board-list-main.component';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import imported from './intialData.json';
import { ConsoleLogger } from '@angular/compiler-cli/private/localize';

@Injectable({
  providedIn: 'root',
})
export class BoardStoreService {
  private $boards: BehaviorSubject<Board[]> = new BehaviorSubject(
    [] as Board[]
  );

  private $lists: BehaviorSubject<List[]> = new BehaviorSubject([] as List[]);

  private $todos: BehaviorSubject<Todo[]> = new BehaviorSubject([] as Todo[]);

  constructor() {}

  fetchBoards() {
    let boards = localStorage.getItem('boards');

    if (boards) {
      this.$boards.next(JSON.parse(boards) as Board[]);
    }
  }

  get boards() {
    return this.$boards.asObservable();
  }

  fetchLists() {
    let lists = localStorage.getItem('lists');

    if (lists) {
      this.$lists.next(JSON.parse(lists) as List[]);
    }
  }

  get lists() {
    return this.$lists.asObservable();
  }

  fetchTodos() {
    let todos = localStorage.getItem('boards');

    if (todos) {
      this.$todos.next(JSON.parse(todos) as Todo[]);
    }
  }

  get todos() {
    return this.$todos.asObservable();
  }

  deleteBoard(id: number) {
    let list = localStorage.getItem('boards')
      ? JSON.parse(localStorage.getItem('boards')!)
      : undefined;

    console.log('Before', list);

    if (list) {
      list = list.filter((board: Board) => {
        return board.id !== id;
      });
    }

    console.log('After', list);

    this.setBoards(list);
    this.fetchBoards();
  }

  setInitialDatas() {
    let { boards, todos, lists } = imported;

    console.log('Initial Datas', boards, todos, lists);

    if (
      !localStorage.getItem('boards') ||
      !localStorage.getItem('lists') ||
      !localStorage.getItem('todos')
    ) {
      localStorage.clear();
      localStorage.getItem('boards') ? undefined : this.setBoards(boards);
      localStorage.getItem('lists') ? undefined : this.setLists(lists);
      localStorage.getItem('todos') ? undefined : this.setTodos(todos);
    }
  }

  setBoards(boardList: Board[]) {
    localStorage.setItem('boards', JSON.stringify(boardList));
  }

  setTodos(todoList: Todo[]) {
    localStorage.setItem('todos', JSON.stringify(todoList));
  }

  setLists(listLists: List[]) {
    localStorage.setItem('lists', JSON.stringify(listLists));
  }

  getBoards() {
    return localStorage.getItem('boards')
      ? JSON.parse(localStorage.getItem('boards')!)
      : undefined;
  }

  getLists() {
    return localStorage.getItem('lists')
      ? JSON.parse(localStorage.getItem('lists')!)
      : undefined;
  }

  getTodos() {
    return localStorage.getItem('todos')
      ? JSON.parse(localStorage.getItem('todos')!)
      : undefined;
  }

  getBoard(id: number) {
    console.log(
      'Finded',
      JSON.parse(localStorage.getItem('boards')!).find((brd: Board) => {
        return brd.id == id;
      })
    );

    return JSON.parse(localStorage.getItem('boards')!).find(
      (brd: Board) => brd.id == id
    );
  }

  dragNDropBoard(previousIndex: number, currentIndex: number) {
    let list = localStorage.getItem('boards')
      ? JSON.parse(localStorage.getItem('boards')!)
      : undefined;

    if (list) {
      moveItemInArray(list, previousIndex, currentIndex);
    }

    this.setBoards(list);
    this.fetchBoards();
  }

  dragNDropList(previousIndex: number, currentIndex: number, boardId: number) {
    let boards = localStorage.getItem('boards')
      ? JSON.parse(localStorage.getItem('boards')!)
      : undefined;

    boards.map((b: Board) => {
      if (b.id === boardId) {
        return {
          ...b,
          listIds: moveItemInArray(b.listIds, previousIndex, currentIndex),
        };
      } else {
        return b;
      }
    });

    this.setBoards(boards);
    this.fetchBoards();
  }

  dragNDropTodo(
    previousIndex: number,
    currentIndex: number,
    previousContainerId: string,
    containerId: string
  ) {
    let lists = localStorage.getItem('lists')
      ? JSON.parse(localStorage.getItem('lists')!)
      : undefined;

    if (previousContainerId === containerId) {
      lists = lists.map((l: List) => {
        if (l.id === parseInt(containerId.split('-')[1])) {
          return {
            ...l,
            listIds: moveItemInArray(l.todoIds, previousIndex, currentIndex),
          };
        } else {
          return l;
        }
      });
    } else {
      let currentList = lists.find((l: List) => {
        return l.id === parseInt(containerId.split('-')[1]);
      });

      let prevList = lists.find((l: List) => {
        return l.id === parseInt(previousContainerId.split('-')[1]);
      });

      transferArrayItem(
        prevList.todoIds,
        currentList.todoIds,
        previousIndex,
        currentIndex
      );

      lists = lists.map((l: List) => {
        if (l.id === parseInt(containerId.split('-')[1])) {
          return { ...l, listIds: currentList };
        }
        if (l.id === parseInt(previousContainerId.split('-')[1])) {
          return { ...l, listIds: prevList };
        } else {
          return l;
        }
      });
    }
    this.setLists(lists);
    this.fetchLists();
  }

  addNewTodo(name: string, description: string, listId: number) {
    let newTodo = this.createNewTodo(name, description, listId);
    let newTodos = this.getTodos();
    newTodos.push(newTodo);
    let newList = this.getLists().reduce((acc: List[], item: List) => {
      if (item.id === listId) {
        item.todoIds.push(newTodo.id);
      }

      return (acc = [...acc, item]);
    }, []);

    console.log('New todos', newTodos);

    this.setTodos(newTodos);
    this.setLists(newList);
    this.fetchTodos();
    this.fetchLists();
  }

  addNewList(name: string, boardId: number) {
    let newList = this.createNewList(name, boardId);
    let lists = this.getLists();
    lists.push(newList);
    let boards = this.getBoards().reduce((acc: Board[], item: Board) => {
      if (item.id === boardId) {
        console.log('Catch', item, newList.id)
        item.listIds.push(newList.id);
      }

      return acc = [...acc, item];
    },[]);

    this.setLists(lists)
    this.setBoards(boards)
    this.fetchLists()
    this.fetchBoards()
    console.log('Add new todo', boards, lists);
  }

  createNewBoard(name: string, description: string) {
    let boards = this.getBoards();
    let board: Board = {
      id: this.createUniqueId(boards),
      name,
      listIds: [],
      description,
      status: 'pending',
      created: new Date().toISOString().split('T')[0],
    };
    0;
    return board;
  }

  createNewList(name: string, boardId: number) {
    let lists = this.getLists();

    let list: List = {
      id: this.createUniqueId(lists),
      name,
      boardId,
      todoIds: [],
      created: new Date().toISOString().split('T')[0],
    };
    return list;
  }

  createNewTodo(name: string, description: string, listId: number) {
    let todos = this.getTodos();

    let todo: Todo = {
      id: this.createUniqueId(todos),
      listId,
      name,
      description,
      created: new Date().toISOString().split('T')[0],
    };

    console.log('New todo', todo);

    return todo;
  }

  addNewBoard(name: string, description: string) {
    let list = this.getBoards();
    let newBoard = this.createNewBoard(name, description);
    list.push(newBoard);
    this.setBoards(list);
    this.fetchBoards();
  }

  createUniqueId(list: any[]) {
    let ids = list.map((item) => item.id);
    return ids.sort()[ids.length - 1] + 1;
  }
}

export interface Board {
  id: number;
  name: string;
  listIds: number[];
  status: 'ready' | 'inProgress' | 'failed' | 'pending' | string;
  description: string;
  created: string;
}

export interface List {
  id: number;
  name: string;
  boardId: number;
  todoIds: number[];
  created: string;
}

export interface Todo {
  id: number;
  listId: number;
  name: string;
  description: string;
  created: string;
}
