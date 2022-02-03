import { Component, OnInit, Input } from '@angular/core';
import { BoardStoreService, List, Todo } from 'src/app/board-store.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { NewTodoDialogComponent } from './new-todo-dialog/new-todo-dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-board-main-list',
  templateUrl: './board-main-list.component.html',
  styleUrls: ['./board-main-list.component.css']
})
export class BoardMainListComponent implements OnInit {

  @Input() public listId: number | null = null
  uniqId: string = ''
  public list: List | undefined = undefined
  public todoList: Todo[] = []
  constructor(public store: BoardStoreService, public dialog: MatDialog, public route: ActivatedRoute) { }

  ngOnInit(): void {

    this.store.fetchLists()
    this.setLists()
    
  }

  setLists(){
    this.store.lists.subscribe((lists: List[]) => {
        this.list = lists.find((list)=> list.id === this.listId)

        if(this.list){
          this.uniqId = (`${this.list.name}-${this.list.id}`).split(' ').join('')
        }
    });

  }

  drop(event: CdkDragDrop<any[]>) {

    let {previousContainer, container, previousIndex, currentIndex} = event
    this.store.dragNDropTodo(previousIndex, currentIndex, previousContainer.element.nativeElement.id, container.element.nativeElement.id)

  }

  openNewTodoDialog(){
    const dialogRef = this.dialog.open(NewTodoDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      let {name, description} = result

      this.store.addNewTodo(name, description, this.listId!)
    });
  }

}
