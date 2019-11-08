import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {NgModule} from '@angular/core';
import {SingUpComponent} from './sing-up/sing-up.component';


const routes: Routes = [
      { path: '', redirectTo: 'Login', pathMatch: 'full'},
      { path: 'Login', component: LoginComponent },
      { path: 'Singup', component: SingUpComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class PublicRoutingModule { }
