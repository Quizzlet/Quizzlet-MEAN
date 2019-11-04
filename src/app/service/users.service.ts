import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

const BACKENDUSER = environment.QuizzletAPI + '/users';

@Injectable()
export class UsersService {

  //--------------------------------------------------------
  constructor(private http: HttpClient) { }

  //--------------------------------------------------------
  LogIn(strEmail: string, strPassword: string) {

    return this.http.post(BACKENDUSER + '/LogIn', {
      strEmail,
      strPassword
    });

  }

  //_--------------------------------------------------------
  SingUp(
    strName: string,
    strMatricula: string,
    strEmail: string,
    strPassword: string
  ) {
    return this.http.post(BACKENDUSER + '/Singup', {
      strName,
      strMatricula,
      strEmail,
      strPassword
    });
  }
}
