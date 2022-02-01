import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardMainComponent } from './board-main/board-main.component';
import { RouterModule } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { BoardMainListComponent } from './board-main-list/board-main-list.component';

@NgModule({
  declarations: [
    BoardMainComponent,
    TodoItemComponent,
    BoardMainListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    DragDropModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class BoardModule { }
