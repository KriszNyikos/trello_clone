import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardListMainComponent } from './board-list/board-list-main/board-list-main.component';
import { BoardMainComponent } from './board/board-main/board-main.component';


const routes: Routes = [
  { path: 'list', component: BoardListMainComponent },
  { path: 'board/:id', component: BoardMainComponent },
  { path: '',   redirectTo: '/list', pathMatch: 'full' },
  { path: '**', component: BoardListMainComponent },
]

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule { }
