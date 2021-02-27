import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  users = [];
  posts = [];
  isLoading = false;

  constructor(private db: AngularFireDatabase, private toastr: ToastrService) {
    this.isLoading = true;

    //get all users
    db.object('/users')
      .valueChanges()
      .subscribe((obj: any) => {
        if (obj) {
          this.users = Object.values(obj);
          this.isLoading = false;
        } else {
          toastr.error('No user found!');
          this.users = [];
          this.isLoading = false;
        }
      });

    db.object('/posts')
      .valueChanges()
      .subscribe((obj: any) => {
        if (obj) {
          this.posts = Object.values(obj);
          this.isLoading = false;
        } else {
          toastr.error('No posts to display!');
          this.posts = [];
          this.isLoading = false;
        }
      });
  }
  ngOnInit(): void {}
}
