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
  @Output() delete = new EventEmitter<any>();

  constructor(public dialog: MatDialog, public store: BoardStoreService) {}

  ngOnInit(): void {}

  deleteBoard(event: any) {
    event.stopPropagation()
    this.delete.emit(this.item);
  }

  openInfo(event: any) {
    event.stopPropagation()
    this.dialog.open(BoardInfoModalComponent, {
      width: '50%',
      data: this.item,
    });
  }

  openEdit(event: any) {
    event.stopPropagation()
    let dialogref = this.dialog.open(NewBoardDialogComponent, {
      width: '50%',
      data: { edit: true, board: this.item },
    });

    dialogref.afterClosed().subscribe((result) => {
      let { name, description } = result;

      if (
        result &&
        (this.item!.name != name || this.item!.description != description)
      ) {
        this.item!.name = name;
        this.item!.description = description;

        this.store.modifyBoard({ name, description }, this.item);
      }
    });
  }
}
