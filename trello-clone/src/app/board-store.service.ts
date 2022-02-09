import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import imported from './intialData.json';

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

  fetchItems(types: 'boards' | 'lists' | 'todos' | string[]) {
    const setNext = (type: string) => {
      let fetchedItem = localStorage.getItem(type);

      switch (type) {
        case 'boards':
          this.$boards.next(JSON.parse(fetchedItem!) as Board[]);
          break;

        case 'lists':
          this.$lists.next(JSON.parse(fetchedItem!) as List[]);
          break;

        case 'todos':
          this.$todos.next(JSON.parse(fetchedItem!) as Todo[]);
          break;

        default:
          break;
      }
    };

    if (typeof types === 'string') {
      setNext(types);
    } else {
      types.forEach((type: string) => {
        setNext(type);
      });
    }
  }

  get boards() {
    return this.$boards.asObservable();
  }

  get lists() {
    return this.$lists.asObservable();
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

    this.setItems(list, 'boards');
    this.fetchItems('boards');
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
      localStorage.getItem('boards')
        ? undefined
        : this.setItems(boards, 'boards');
      localStorage.getItem('lists') ? undefined : this.setItems(lists, 'lists');
      localStorage.getItem('todos') ? undefined : this.setItems(todos, 'todos');
    }
  }

  setItems(
    list: Board[] | Todo[] | List[],
    type: 'boards' | 'lists' | 'todos'
  ) {
    localStorage.setItem(type, JSON.stringify(list));
  }

  getItem(type: 'boards' | 'lists' | 'todos') {
    return localStorage.getItem(type)
      ? JSON.parse(localStorage.getItem(type)!)
      : undefined;
  }

  getBoard(id: number) {
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

    this.setItems(list, 'boards');
    this.fetchItems('boards');
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

    this.setItems(boards, 'boards');
    this.fetchItems('boards');
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

    lists =
      previousContainerId === containerId
        ? this.moveTodosInOneList(
            lists,
            containerId,
            previousIndex,
            currentIndex
          )
        : this.moveTodosToOtherList(
            lists,
            containerId,
            previousContainerId,
            previousIndex,
            currentIndex
          );
    this.setItems(lists, 'lists');
    this.fetchItems('lists');
  }

  moveTodosInOneList(
    lists: any,
    containerId: string,
    previousIndex: number,
    currentIndex: number
  ) {
    return lists.map((l: List) => {
      if (l.id === parseInt(containerId.split('-')[1])) {
        return {
          ...l,
          listIds: moveItemInArray(l.todoIds, previousIndex, currentIndex),
        };
      } else {
        return l;
      }
    });
  }

  moveTodosToOtherList(
    lists: any,
    containerId: string,
    previousContainerId: string,
    previousIndex: number,
    currentIndex: number
  ) {
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

    return lists.map((l: List) => {
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

  addNewTodo(name: string, description: string, listId: number) {
    let newTodo = this.createNewTodo(name, description, listId);
    let todoList = this.getItem('todos');
    todoList.push(newTodo);
    let newList = this.getItem('lists').reduce((acc: List[], item: List) => {
      if (item.id === listId) {
        item.todoIds.push(newTodo.id);
      }

      return (acc = [...acc, item]);
    }, []);

    console.log('New todos', todoList);

    this.setItems(todoList, 'todos');
    this.setItems(newList, 'lists');
    this.fetchItems(['todos', 'lists']);
  }

  addNewList(name: string, boardId: number) {
    let newList = this.createNewList(name, boardId);
    let lists = this.getItem('lists');
    lists.push(newList);
    let boards = this.getItem('boards').reduce((acc: Board[], item: Board) => {
      if (item.id === boardId) {
        console.log('Catch', item, newList.id);
        item.listIds.push(newList.id);
      }

      return (acc = [...acc, item]);
    }, []);

    this.setItems(lists, 'lists');
    this.setItems(boards, 'boards');
    this.fetchItems(['lists', 'boards']);
    console.log('Add new todo', boards, lists);
  }

  createNewBoard(name: string, description: string) {
    let boards = this.getItem('boards');
    let board: Board = {
      id: this.createUniqueId(boards),
      name,
      listIds: [],
      description,
      status: 'pending',
      created: new Date().toISOString().split('T')[0],
    };
    return board;
  }

  createInitialLists(boardId: number){
    let initListNames = ['Todo', 'In progress', 'Done']

    initListNames.forEach((name: string)=>{
      this.addNewList(name, boardId)
    })
  }

  createNewList(name: string, boardId: number) {
    let lists = this.getItem('lists');

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
    let todos = this.getItem('todos');

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
    let list = this.getItem('boards');
    let newBoard = this.createNewBoard(name, description);
    list.push(newBoard);
    this.setItems(list, 'boards');
    this.createInitialLists(newBoard.id)
    this.fetchItems('boards');
    this.fetchItems('lists')
    
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
