import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {PrivateGuard} from './private.guard';
import {PublicGuard} from './public.guard';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [PrivateGuard, PublicGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
