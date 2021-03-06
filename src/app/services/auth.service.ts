import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: AngularFireAuth) {}

  singUp(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  singIn(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }
  getUser() {
    return this.auth.authState;
  }
  singOut() {
    return this.auth.signOut();
  }
}
