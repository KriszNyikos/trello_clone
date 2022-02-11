import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Board } from 'src/app/board-store.service';
import { MatDialog } from '@angular/material/dialog';
import { BoardInfoModalComponent } from '../board-info-modal/board-info-modal.component';
import { NewBoardDialogComponent } from '../new-board-dialog/new-board-dialog.component';
import { BoardStoreService } from 'src/app/board-store.service';

@Component({
  selector: 'app-board-item',
  templateUrl: './board-list-item.component.html',
  styleUrls: ['./board-list-item.component.css'],
})
export class BoardListItemComponent implements OnInit {
  @Input() item: Board | undefined;
  @Output() delete = new EventEmitter<number>();

  constructor(public dialog: MatDialog, public store: BoardStoreService) {}

  ngOnInit(): void {}

  deleteBoard() {
    this.delete.emit(this.item?.id);
  }

  openInfo(){
    this.dialog.open(BoardInfoModalComponent,{ width: '50%', data: this.item})
  }

  openEdit(){
    let dialogref = this.dialog.open(NewBoardDialogComponent, { width: '50%', data: {edit: true, board: this.item}})

    dialogref.afterClosed().subscribe((result)=>{

      console.log('Close', result)

      let {name, description} = result

      if (result && (this.item!.name != name || this.item!.description != description)) {
        this.store.modifyBoard(this.item!.id, { name, description })
      }
    })


  }
}
