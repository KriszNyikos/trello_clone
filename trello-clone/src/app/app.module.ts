import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BoardModule } from './board/board.module';
import { BoardListModule } from './board-list/board-list.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { MatCardModule } from '@angular/material/card';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MoveToDialogzComponent } from './move-to-dialogz/move-to-dialogz.component';


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ContextMenuComponent,
    MoveToDialogzComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BoardModule,
    BoardListModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
