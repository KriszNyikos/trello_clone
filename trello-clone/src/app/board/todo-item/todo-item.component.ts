import { Component, OnInit, Input } from '@angular/core';
import { Board, BoardStoreService } from 'src/app/board-store.service';
import { MatDialog } from '@angular/material/dialog';
import { NewTodoDialogComponent } from '../board-main-list/new-todo-dialog/new-todo-dialog.component';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {

  constructor(public store: BoardStoreService, public dialog: MatDialog) { }

  @Input() inputTodo : any | null = null
  public todo : any = undefined

  ngOnInit(): void {
    this.todo = this.inputTodo
  }

  deleteTodo(){
    this.store.deleteTodo(this.todo)
  }

  modifyDialog(){
    this.dialog.open(NewTodoDialogComponent, {data: {todo: this.todo, modify: true}}).afterClosed().subscribe((res)=>{

      let {name, description} = res

      if (
        res &&
        (this.todo!.name != name || this.todo!.description != description)
      ) {
        this.todo!.name = name;
        this.todo!.description = description;
        console.log('Mod todo', res)
        this.store.modifyTodo({ name, description }, this.todo);
      }
    })  
      

  }

}
