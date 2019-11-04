import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UsersService} from '../../service/users.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.css']
})
export class SingUpComponent implements OnInit {

  singupForm: FormGroup;
  strMessage: string;
  strType: string;
  boolShow = false;

  //--------------------------------------------------------
  constructor(
    private usersService: UsersService,
    private router: Router
  ) { }

  //--------------------------------------------------------
  ngOnInit() {
    this.singupForm = new FormGroup({
      Name: new FormControl(null, {
        validators: [
          Validators.required
        ]
      }),
      Matricula: new FormControl(null, {
        validators: [
          Validators.required
        ]
      }),
      Email: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.email
        ]
      }),
      Password: new FormControl(null, {
        validators: [
          Validators.required,
        ]
      }),
      ConfirmPassword: new FormControl(null, {
        validators: [
          Validators.required
        ]
      })
    });
  }

  //--------------------------------------------------------
  onSubmit() {
    if (this.singupForm.invalid) {
      this.strMessage = 'Fill in the fields';
      this.strType = 'danger';
      this.onDisplayAlert();
      return;
    }

    if (
      this.singupForm.value.Password !==
      this.singupForm.value.ConfirmPassword
    ) {
      this.strMessage = 'Passwords do not match';
      this.strType = 'danger';
      this.onDisplayAlert();
      return;
    }

    this.usersService.SingUp(
      this.singupForm.value.Name,
      this.singupForm.value.Matricula,
      this.singupForm.value.Email,
      this.singupForm.value.Password
    ).subscribe((result: any) => {
      this.strMessage = result.message;
      this.strType = 'primary';
      this.onDisplayAlert();
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
      this.router.navigate(['/Login']);
    }.bind(this), 3000);
  }
}
