import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardMainComponent } from './board-main/board-main.component';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { BoardMainListComponent } from './board-main-list/board-main-list.component';
import { NewTodoDialogComponent } from './board-main-list/new-todo-dialog/new-todo-dialog.component';
import { NewListDialogComponent } from './board-main/new-list-dialog/new-list-dialog.component';
import {MatListModule} from '@angular/material/list';
import { MoveToDialogComponent } from './move-to-dialog/move-to-dialog.component';

@NgModule({
  declarations: [
    BoardMainComponent,
    TodoItemComponent,
    BoardMainListComponent,
    NewTodoDialogComponent,
    NewListDialogComponent,
    MoveToDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    DragDropModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
  ],
})
export class BoardModule {}

