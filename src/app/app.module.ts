import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {PublicModule} from './public/public.module';
import {PrivateModule} from './private/private.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PublicModule,
    PrivateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
