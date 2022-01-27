import { Component, OnInit } from '@angular/core';
import { BoardStoreService } from './board-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private store: BoardStoreService) {}

  ngOnInit(): void {
    this.store.setInitialBoardList()
  }

  title = 'trello-clone';
}
