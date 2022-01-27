import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Board } from 'src/app/board-store.service';
import { BoardStoreService } from 'src/app/board-store.service';

@Component({
  selector: 'app-board-item',
  templateUrl: './board-list-item.component.html',
  styleUrls: ['./board-list-item.component.css']
})
export class BoardListItemComponent implements OnInit {

  @Input() item : Board | undefined 
  @Output() delete =  new EventEmitter<number>()



  constructor(private store: BoardStoreService) { }

  ngOnInit(): void {

  }

  deleteBoard(){
    this.delete.emit(this.item?.id)
  }

}
