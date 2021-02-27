import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  email: string | null | undefined;
  constructor(
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    auth.getUser().subscribe((user) => {
      console.log('User is', user);
      this.email = user?.email;
    });
  }
  async handleSignOut() {
    try {
      await this.auth.singOut();
      this.router.navigateByUrl('/signin');
      this.toastr.info('LogOut Success');
      this.email = null;
    } catch (err) {
      this.toastr.error('signout propblem!');
    }
  }
  ngOnInit(): void {}
}
