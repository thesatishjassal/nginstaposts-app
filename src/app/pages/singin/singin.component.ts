import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-singin',
  templateUrl: './singin.component.html',
  styleUrls: ['./singin.component.css'],
})
export class SinginComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSingIn(singin: NgForm) {
    const { email, password } = singin.value;
    this.auth
      .singIn(email, password)
      .then((res) => {
        this.toastr.success('Sign Success!');
        this.router.navigateByUrl('/');
      })
      .catch((err) => {
        this.toastr.error('SignIn Faild', '', {
          closeButton: true,
        });
      });
  }
}
