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

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.css'],
})
export class SingupComponent implements OnInit {
  picture: string = `https://images.pexels.com/photos/5651673/pexels-photo-5651673.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260`;
  uploadPercent: number | undefined;
  imageId: string | undefined;

  constructor(
    private auth: AuthService,
    private router: Router,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  onSubmit(signup: NgForm) {
    let userdetail = signup.value;
    const {
      email,
      password,
      username,
      country,
      bio,
      firstname,
      instaUserName,
    } = userdetail;

    this.auth
      .singUp(email, password)
      .then((res) => {
        console.log(res);
        const uid = res.user?.uid;
        console.log(uid);
        this.db.object(`/users/${uid}`).set({
          id: uid,
          firstname: firstname,
          email: email,
          instaUserName: instaUserName,
          bio: bio,
          country: country,
          picture: this.picture,
        });
      })
      .then(() => {
        this.router.navigateByUrl('/');
        this.toastr.success('SignUp Success!');
      })
      .catch((err) => {
        this.toastr.error('Singup Falied!');
        console.log(err);
      });
  }

  async uploadFile(event: any) {
    const file = event.target.files[0];

    let resizedImage = await readAndCompressImage(file, ImageConfig);

    const filePath = file.name; // rename the image with TODO: UUID
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
            this.toastr.success('image upload success');
          });
        })
      )
      .subscribe();
  }
}
