import { Component, OnInit, Input } from '@angular/core';
import { Board, BoardStoreService } from 'src/app/board-store.service';
import { MatDialog } from '@angular/material/dialog';
import { NewTodoDialogComponent } from '../board-main-list/new-todo-dialog/new-todo-dialog.component';
import { ContextMenuService } from 'src/app/context-menu.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {

  constructor(public store: BoardStoreService, public dialog: MatDialog, public context:ContextMenuService) { }

  public isContextMenuOpen: boolean = false
  public contexPosition = {
    left: 200,
    top: 200
  }

  @Input() inputTodo : any | null = null
  public todo : any = undefined

  ngOnInit(): void {
    this.todo = this.inputTodo
  }

  deleteTodo(){
    this.isContextMenuOpen = false
    this.store.deleteTodo(this.todo)
  }

  contextOpen(event: any){
    event.preventDefault()
    event.stopPropagation()
    this.context.openTodoContext(event, this.todo)
  }



  modifyDialog(){
    this.isContextMenuOpen = false
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
