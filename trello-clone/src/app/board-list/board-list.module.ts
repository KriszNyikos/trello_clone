import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardListMainComponent } from './board-list-main/board-list-main.component';
import { BoardListItemComponent } from './board-item/board-list-item.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NewBoardDialogComponent } from './new-board-dialog/new-board-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { BoardInfoModalComponent } from './board-info-modal/board-info-modal.component';

@NgModule({
  declarations: [
    BoardListMainComponent,
    BoardListItemComponent,
    NewBoardDialogComponent,
    BoardInfoModalComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    DragDropModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    MatIconModule,
  ],
  exports: [BoardListMainComponent],
})
export class BoardListModule {}
