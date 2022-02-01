import { Component, OnInit, Input } from '@angular/core';
import { BoardStoreService, List, Todo } from 'src/app/board-store.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

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
  constructor(public store: BoardStoreService) { }

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

    console.log('Component, draganddrop todo:', previousIndex, currentIndex, previousContainer.element.nativeElement.id, container.element.nativeElement.id)
    this.store.dragNDropTodo(previousIndex, currentIndex, previousContainer.element.nativeElement.id, container.element.nativeElement.id)

   /* console.log('Droopppp', event.container)
    if (event.previousContainer === event.container) {
      console.log('Same')
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log('Not Same', event.container.element.nativeElement.id)
      this.store.dragNDropTodo()

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }*/
  }

}
