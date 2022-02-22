import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {

  constructor() { }

  @Input() inputTodo : any | null = null
  public todo : any = undefined

  ngOnInit(): void {
    this.todo = this.inputTodo
  }


}
