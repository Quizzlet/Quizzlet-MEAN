import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import {PublicRoutingModule} from './public-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {UsersService} from '../service/users.service';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from '../shared/shared.module';
import { SingUpComponent } from './sing-up/sing-up.component';
import { PublicComponent } from './component/public.component';



@NgModule({
  declarations: [
    LoginComponent,
    SingUpComponent,
    PublicComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    UsersService
  ]
})
export class PublicModule { }
