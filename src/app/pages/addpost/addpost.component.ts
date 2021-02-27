import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { NgForm } from '@angular/forms';
import { readAndCompressImage } from 'browser-image-resizer';
import { ImageConfig } from './../../../utills/config';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.css'],
})
export class AddpostComponent implements OnInit {
  locationName!: string;
  description!: string;
  user: any;
  picture!: string;
  uploadPercent!: any;

  constructor(
    private auth: AuthService,
    private storage: AngularFireStorage,
    private toastr: ToastrService,
    private db: AngularFireDatabase,
    private router: Router
  ) {
    auth.getUser().subscribe((user) => {
      this.db
        .object(`/users/${user!.uid}`)
        .valueChanges()
        .subscribe((user) => {
          this.user = user;
        });
    });
  }
  ngOnInit(): void {}

  onSubmit() {
    const uid = uuidv4();
    console.log(uid);
    this.db
      .object(`/posts/${uid}`)
      .set({
        uid: uid,
        locationName: this.locationName,
        description: this.description,
        picture: this.picture,
        instaId: this.user.instaUserName,
        date: Date.now(),
      })
      .then(() => {
        this.toastr.success('Post Added SuccesFully!');
        this.router.navigateByUrl('/');
      })
      .catch((err) => {
        this.toastr.error('Something Went Worng!');
      });
  }

  async uploadFile(event) {
    const files = event.target.files[0];

    let resizedImage = await readAndCompressImage(files, ImageConfig);

    const filePath = files.name;
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, resizedImage);

    task.percentageChanges().subscribe((percetage) => {
      this.uploadPercent = percetage;
    });

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.picture = url;
          });
        })
      )
      .subscribe();
  }
}
