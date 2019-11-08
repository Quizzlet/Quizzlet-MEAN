import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateComponent } from './component/private.component';
import {PrivateRoutingModule} from './private-routing.module';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [PrivateComponent, NavbarComponent],
  imports: [
    CommonModule,
    PrivateRoutingModule
  ]
})
export class PrivateModule { }
