import { Component, OnInit, Input, OnChanges } from '@angular/core';
import {
  faThumbsUp,
  faThumbsDown,
  faShareSquare,
} from '@fortawesome/free-regular-svg-icons';
import { AuthService } from './../../services/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit, OnChanges {
  uid: any;
  upvote: number = 0;
  downvote = 0;

  @Input()
  posts;

  constructor(private db: AngularFireDatabase, private auth: AuthService) {
    this.auth.getUser().subscribe((user) => {
      this.uid = user?.uid;
    });
  }
  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.posts.vote) {
      Object.values(this.posts.vote).map((val: any) => {
        if (val.upvote) {
          this.upvote += 1;
        }
        if (val.downvote) {
          this.downvote += 1;
        }
      });
    }
  }
  upvotePost() {
    console.log('Upvoting');
    this.db.object(`/posts/${this.posts.uid}/vote/${this.uid}`).set({
      upvote: 1,
    });
  }

  DownvotePost() {
    console.log('Upvoting');
    this.db.object(`/posts/${this.posts.uid}/vote/${this.uid}`).set({
      downvote: 1,
    });
  }

  getInstaUrl() {
    return `https://instagram.com/${this.posts.instaId}`;
  }
}
