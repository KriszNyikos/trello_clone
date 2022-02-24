import { Component, OnInit, HostListener } from '@angular/core';
import { BoardStoreService } from './board-store.service';
import { ContextMenuService } from './context-menu.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private store: BoardStoreService, private context: ContextMenuService) {}


  @HostListener('contextmenu', ['$event'])
  handleContext(event: any){
    event.preventDefault()
    this.context.resetAllContext()
  }

  @HostListener('click', ['$event'])
  handleClick(event: any){
    event.preventDefault()
    this.context.resetAllContext()
  }

  ngOnInit(): void {
    
  }

  title = 'trello-clone';
}
