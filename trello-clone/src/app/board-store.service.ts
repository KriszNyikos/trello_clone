import { Injectable, NgModuleRef } from '@angular/core';
import { BehaviorSubject, merge, mergeMap, of, interval, forkJoin } from 'rxjs';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import imported from './intialData.json';
import { HttpService } from './http.service';
import { map, tap, expand } from 'rxjs/operators';
import { textChangeRangeIsUnchanged } from 'typescript';
@Injectable({
  providedIn: 'root',
})
export class BoardStoreService {
  private $boards: BehaviorSubject<any[]> = new BehaviorSubject([] as any[]);

  private lists: List[] = [] as List[];

  private todos: Todo[] = [] as Todo[];

  constructor(private http: HttpService) {
    this.fetchBoards();
    this.$boards.subscribe(console.log);
  }


  fetchBoards() {
    this.http.apiGet('db').subscribe((db: any) => {
      const { boards, lists, todos } = db;

      this.lists = lists.map((l: any) => new List({...l, todos: l.todoIds.map((td: any) => todos.find((t: any) => t.id == td))}))

      console.log('FetchBoards Lists', this.lists)

      this.todos = todos;

      let newBoards = this.createBoards(boards);

      this.$boards.next(newBoards);

      console.log('Fetch 2', this.$boards.getValue());
    });
  }

  createBoards(boards: any) {
    let newBoards = boards.reduce((acc: any, board: any) => {
      acc = [...acc, new Board({...board, lists : this.createLists(board.id) })];

      return acc;
    }, []);

    return newBoards.sort((a: any, b: any) => a.order - b.order);
  }

  createLists(boarId: number) {
    let newLists = this.lists
      .filter((l: any) => l.boardId === boarId)
      .reduce((acc: any, l: any) => {
        acc = [...acc, new List({...l, todos: this.createTodos(l.id)})];
        return acc;
      }, []);

    return newLists.sort((a: any, b: any) => a.order - b.order);
  }

  createTodos(listId: number) {
    let newTodos = this.todos
      .filter((t: any) => t.listId === listId)
      .reduce((acc: any, t: any) => {
        acc = [...acc, new Todo(t)];
        return acc;
      }, []);

    return newTodos.sort((a: any, b: any) => a.order - b.order);
  }

  get boards() {
    return this.$boards.asObservable();
  }

  deleteBoard(board: any) {
    let requests = board.lists.reduce((acc: any, l: any) => {
      acc = [...acc, this.http.apiDel(`lists/${l.id}`)];
      return acc;
    }, []);

    requests = [...requests, this.http.apiDel(`boards/${board.id}`)];

    forkJoin(requests).subscribe(() => {
      this.fetchBoards();
    });
  }

  deleteList(inputList: any) {
    this.http
      .apiDel(`lists/${inputList.id}`)
      .pipe(
        mergeMap(() => {
          let selectedBoard = this.$boards
            .getValue()
            .find((b: any) => b.id === inputList.boardId);

          return this.http.apiPatch(`boards/${selectedBoard.id}`, {
            listIds: selectedBoard.lists
              .map((list: any) => list.id)
              .filter((listId: any) => listId !== inputList.id),
          });
        })
      )
      .subscribe((res) => {
        this.fetchBoards();
      });
  }

  deleteTodo(inputTodo: Todo){


    this.http.apiDel(`todos/${inputTodo.id}`).pipe(
      mergeMap(()=>{
        let newListOfTodoIds = this.lists.find((list)=> list.id === inputTodo.listId)!.todos.reduce((acc: number[], todo: any)=>{
          if(todo.id !== inputTodo.id){
            acc = [...acc, todo.id]
          }
          return acc
        },[])

        console.log("new ids", newListOfTodoIds)

        return this.http.apiPatch(`lists/${inputTodo.listId}`, {todoIds: newListOfTodoIds})
      })
    ).subscribe((res)=>{
      this.fetchBoards()
    })

  }

  dragNDropBoard(previousIndex: number, currentIndex: number) {
    let boards: Board[] = [...this.$boards.getValue()];

    moveItemInArray(boards, previousIndex, currentIndex);

    const apiRequests = boards.map((board: Board, index) => {
      let body = { order: index };
      return this.http.apiPatch(`boards/${board.id}`, body);
    });

    forkJoin(apiRequests).subscribe(() => {
      this.fetchBoards();
    });
  }

  dragNDropList(previousIndex: number, currentIndex: number, boardId: number) {
    let listsOfBoard: List[] = this.lists
      .filter((l: List) => l.boardId === boardId)
      .sort((a: any, b: any) => a.order - b.order);

    moveItemInArray(listsOfBoard, previousIndex, currentIndex);

    console.log('List of vboards', listsOfBoard, previousIndex, currentIndex);

    const apiRequests = listsOfBoard.map((list: List, index) => {
      let body = { order: index };
      return this.http.apiPatch(`lists/${list.id}`, body);
    });

    forkJoin(apiRequests).subscribe(() => {
      this.fetchBoards();
    });
  }

  dragNDropTodo(
    previousIndex: number,
    currentIndex: number,
    previousContainerId: string,
    containerId: string,
    todoId: string
  ) {
    if (previousContainerId === containerId) {
      this.moveTodosInOneList(containerId, previousIndex, currentIndex);
    } else {
      this.moveTodosToOtherList(
        containerId,
        previousContainerId,
        previousIndex,
        currentIndex,
        todoId
      );
    }

  }

  moveTodosInOneList(
    containerId: string,
    previousIndex: number,
    currentIndex: number
  ) {
    let todosofLists: Todo[] = this.todos
      .filter((t: Todo) => t.listId === parseInt(containerId))
      .sort((a: any, b: any) => a.order - b.order);

    moveItemInArray(todosofLists, previousIndex, currentIndex);

    const apiRequests = todosofLists.map((todo: Todo, index) => {
      let body = { order: index };
      return this.http.apiPatch(`todos/${todo.id}`, body);
    });

    forkJoin(apiRequests).subscribe(() => {
      this.fetchBoards();
    });
  }

  moveTodosToOtherList(
    containerId: string,
    previousContainerId: string,
    previousIndex: number,
    currentIndex: number,
    todoId: string
  ) {

    
    let currentList = this.lists.find((l: List) => {
      return l.id === parseInt(containerId);
    });

    let prevList = this.lists.find((l: List) => {
      return l.id === parseInt(previousContainerId);
    });

    transferArrayItem(
      prevList!.todos,
      currentList!.todos,
      previousIndex,
      currentIndex
    );

    let prevIds = prevList?.todos.map((todo: any) => todo.id);
    let currentIds = currentList?.todos.map((todo: any) => todo.id);

    let prevTodoRequests = prevList!.todos.length ? prevList!.todos.map((todo: Todo, index) => {
      let body = { order: index, listId: prevList!.id };
      return this.http.apiPatch(`todos/${todo.id}`, body);
    }) : []

    let currentTodoRequests = currentList!.todos.length ? currentList!.todos.map((todo: Todo, index) => {
      let body = { order: index, listId: currentList!.id };
      return this.http.apiPatch(`todos/${todo.id}`, body);
    }) : []

    let prevListRequest = this.http.apiPatch(`lists/${prevList!.id}`, {todoIds : prevIds}) 
    let currentListRequest = this.http.apiPatch(`lists/${currentList!.id}`, {todoIds : currentIds})

    forkJoin([...prevTodoRequests, ...currentTodoRequests, prevListRequest, currentListRequest]).subscribe(()=> this.fetchBoards())

  }

  addNewTodo(nme: string, dscpr: string, lid: number) {
  
  let newTodo = this.createNewTodo(nme, dscpr, lid)
    let {id, name, listId, description, order, createdAt} = newTodo

    this.http
      .apiPost('todos', new TodoDto({id, name, listId, description, order, createdAt}))
      .pipe(
        mergeMap((todo: any) => {
          const findedList = this.lists.find((l: any) => l.id === listId)

          let updatedList = {} as ListDto
         
          if(findedList){
            let {id, name, todos, boardId, createdAt, order} = findedList
            updatedList = new ListDto({id, name, todos: [...todos, newTodo], boardId, createdAt, order})
          }

          return this.http.apiPatch(`lists/${updatedList.id}`, updatedList);
        })
      )
      .subscribe((res) => {
        this.fetchBoards();
      });
  }

  addNewList(listName: string, board: any) {
    let {id, name, createdAt, boardId, order, todos} = this.createNewList(listName, board);
    const createdList = new ListDto({id, name, createdAt, boardId, order, todos});
    board.lists.push(createdList)

    this.http
      .apiPost(`lists`, createdList)
      .pipe(
        mergeMap((list: any) => {
          return this.http.apiPatch(`boards/${board.id}`, new BoardDto(board));
        })
      )
      .subscribe((res: any) => {
        this.fetchBoards();
      });
  }

  createNewBoard(name: string, description: string) {
    let boards = this.$boards.getValue();
    let newBoard: Board = {
      id: this.createUniqueId(boards),
      name,
      lists: [],
      description,
      createdAt: new Date(),
      order: boards.length,
    };

    return newBoard;
  }

  createNewList(name: string, board: any) {
    let listOfLists = this.lists.filter((l: List) => l.boardId === board.id);

    let list: List = {
      id: this.createUniqueId(this.lists),
      name,
      boardId: board.id,
      todos: [],
      createdAt: new Date(),
      order: listOfLists.length,
    };

    return list;
  }

  createNewTodo(name: string, description: string, listId: number) {
    let listOfTodos = this.todos.filter((t: Todo) => t.listId === listId);

    let todo: Todo = {
      id: this.createUniqueId(this.todos),
      listId,
      name,
      description,
      createdAt: new Date(),
      order: listOfTodos.length,
    };

    return todo;
  }

  addNewBoard(name: string, description: string) {
    let newBoard = this.createNewBoard(name, description);
    let boardDto = new BoardDto(newBoard);
    console.log('Board Dto', boardDto);
    this.http.apiPost('boards', boardDto).subscribe((res: any) => {
      this.fetchBoards();
    });
  }

  modifyBoard(fields: any, board: any) {
    let { name, description } = fields;
    let urlExt = `boards/${board.id}`;
    this.http
      .apiPatch(urlExt, { name, description })
      .subscribe((response: any) => {
        this.fetchBoards();
      });
  }

  modifyList(name: string, list: List){
    this.http.apiPatch(`lists/${list.id}`, {name}).subscribe((res)=>{
      this.fetchBoards()
    })
  }

  modifyTodo(field: {name: string, description: string}, todo: Todo){
    let {name, description} = field

    this.http.apiPatch(`todos/${todo.id}`, {name, description}).subscribe(()=>{
      this.fetchBoards()
    })
  }

  createUniqueId(elements: any[]) {
    console.log('Unique ID', elements)
    if(elements.length){
      return elements.sort((a: any, b: any) => a.id - b.id)[elements.length - 1].id + 1
    } else return 1
   
  }
}

type CommonBoardType = {
  id: number;
  name: string;
  description: string;
  createdAt: number | Date;
  order: number;
  lists: List[];
};

type CommonListType = {
  id: number;
  name: string;
  boardId: number;
  createdAt: number | Date;
  order: number;
  todos: Todo[];
};

type CommonTodoType = {
  id: number;
  name: string;
  listId: number;
  description: string;
  createdAt: number | Date;
  order: number;
};

export class BoardDto {
  id;
  name;
  listIds;
  description;
  createdAt;
  order;

  constructor({
    id,
    name,
    lists,
    description,
    createdAt,
    order,
  }: CommonBoardType) {
    (this.id = id), (this.name = name);
    this.listIds = lists.map((l: any) => l.id);
    this.description = description;
    this.createdAt = new Date(createdAt).valueOf();
    this.order = order;
  }
}

export class Board {
  id;
  name;
  lists;
  description;
  createdAt;
  order;

  constructor({
    id,
    name,
    lists,
    description,
    createdAt,
    order,
  }: CommonBoardType) {
    // deconstruct at creating, delete separate lists input

    (this.id = id), (this.name = name);
    this.lists = lists;
    this.description = description;
    this.createdAt = (typeof createdAt === 'number') ?  new Date(createdAt * 1000) : createdAt
    this.order = order;
  }
}

export class ListDto {
  id;
  name;
  boardId;
  todoIds;
  createdAt;
  order;

  constructor({ id, name, boardId, todos, createdAt, order }: CommonListType) {
    this.id = id;
    this.name = name;
    this.boardId = boardId;
    this.todoIds = todos.map((t: any) => t.id);
    this.createdAt = new Date(createdAt).valueOf();
    this.order = order;
  }
}

export class List {
  id;
  name;
  boardId;
  todos;
  createdAt;
  order;

  constructor({ id, name, boardId, todos, createdAt, order }: CommonListType) {
    this.id = id;
    this.name = name;
    this.boardId = boardId;
    this.todos = todos;
    this.createdAt = (typeof createdAt === 'number') ?  new Date(createdAt * 1000) : createdAt
    this.order = order;
  }
}


export class TodoDto {
  id;
  name;
  listId;
  createdAt;
  description;
  order;

  constructor({id, name, listId, description, createdAt, order}: CommonTodoType) {
    this.id = id;
    this.name = name;
    this.listId = listId;
    this.description = description;
    this.createdAt = new Date(createdAt).valueOf();
    this.order = order;
  }
}

export class Todo {
  id;
  name;
  listId;
  description;
  createdAt;
  order;

  constructor({id, name, listId, description, createdAt, order}: CommonTodoType) {
    this.id = id;
    this.name = name;
    this.listId = listId;
    this.description = description;
    this.createdAt = (typeof createdAt === 'number') ?  new Date(createdAt * 1000) : createdAt
    this.order = order;
  }
}

