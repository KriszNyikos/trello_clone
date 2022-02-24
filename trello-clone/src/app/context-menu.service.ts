import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Todo } from './board-store.service';
import { ContextMenuComponent } from './context-menu/context-menu.component';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {

  constructor(private dialog: MatDialog) { }

  openTodoContext(event:any, todo: Todo){
    this.dialog.closeAll()
    let {clientX, clientY} = event

    const dialogConfig = new MatDialogConfig()
    dialogConfig.autoFocus = true
    dialogConfig.position = {
      top:  `${clientY}px`,
      left: `${clientX}px`,
    }
    dialogConfig.data = todo
    dialogConfig.hasBackdrop = false
    dialogConfig.panelClass = 'context-menu'

    this.dialog.open(ContextMenuComponent, dialogConfig).afterClosed().subscribe(()=>{
      
    })
  }

  resetAllContext(){
    this.dialog.closeAll()
  }

}
