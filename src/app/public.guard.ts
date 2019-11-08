import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class PublicGuard implements CanActivate {

  //--------------------------------------------------------
  constructor(private router: Router) {}

  //--------------------------------------------------------
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const userData = localStorage.getItem('User');

    if (userData) {
      this.router.navigate(['/private/Home']);
      return false;
    }

    return true;
  }
}
