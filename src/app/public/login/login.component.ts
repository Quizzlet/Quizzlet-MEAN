import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UsersService} from '../../service/users.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  strMessage: string;
  strType: string;
  boolShow = false;

  //--------------------------------------------------------
  constructor(
    private userService: UsersService,
    private router: Router
  ) { }

  //--------------------------------------------------------
  ngOnInit() {
    this.loginForm = new FormGroup({
      Email: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.email
        ]
      }),
      Password: new FormControl(null, {
        validators: [
          Validators.required
        ]
      })
    });
  }

  //--------------------------------------------------------
  onLogIn() {
    if(this.loginForm.invalid) {
      this.strMessage = 'Fill in the fields';
      this.strType = 'danger';
      this.onDisplayAlert();
      return;
    }
    this.userService.LogIn(
      this.loginForm.value.Email,
      this.loginForm.value.Password
    ).subscribe((data) => {
      localStorage.setItem('User', JSON.stringify(data));
      this.router.navigate(['/private/Home/Groups']);
    }, (error) => {
      this.strMessage = error.error.message;
      this.strType = 'danger';
      this.onDisplayAlert();
    });
  }

  //--------------------------------------------------------
  onDisplayAlert() {
    this.boolShow = true;
    setTimeout(function() {
      this.boolShow = false;
    }.bind(this), 3000);
  }

}
