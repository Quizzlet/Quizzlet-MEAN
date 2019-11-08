import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PrivateGuard} from './private.guard';
import {PublicGuard} from './public.guard';


const routes: Routes = [
  { path: '', redirectTo: 'public', pathMatch: 'full'},
  { path: 'public', loadChildren: () =>
      import('./public/public.module').then(m => m.PublicModule),
      canActivate: [PublicGuard]
  },
  { path: 'private', loadChildren: () =>
      import('./private/private.module').then(m => m.PrivateModule),
      canActivate: [PrivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
