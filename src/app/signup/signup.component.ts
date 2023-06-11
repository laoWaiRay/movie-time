import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, query, where, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { Subject } from 'rxjs';
import { FormData } from 'src/interfaces/FormData';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  emailError$ = new Subject<string>();

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  async signUpUser(data: FormData) {
    const usersRef = collection(this.firestore, "users");
    const q_email = query(usersRef, where("email", "==", data.email));
    const q_username = query(usersRef, where("username", "==", data.username));
    const querySnapshots = await Promise.all([getDocs(q_email), getDocs(q_username)]);
    // // If # of docs matching email is 0, create a new account
    if (querySnapshots[0].size + querySnapshots[1].size === 0 ) {
      // Create user profile in the database
      try {
        await setDoc(doc(this.firestore, "users", data.email), {
          email: data.email,
          username: data.username,
          moviesWatched: [],
          moviesWanted: [],
          friends: [],
          favoriteMovies: []
        })
      } catch (error) {
        console.log(error);
        // If first DB update fails, do not attempt to update auth server
        return;
      }

      // Create user in auth server
      try {
        await this.authService.createAccount(data.email, data.password);
      } catch (error) {
        // If auth server update fails, roll back changes to DB -- What if this fails?
        await deleteDoc(doc(this.firestore, "users", data.email));
        console.log(error);
      }

      console.log('successful sign up');
    } else {
      console.log('user already exists in db');
      // Set error message if email already exists in DB
      if (querySnapshots[0].size > 0)
        this.emailError$.next("This email address has already been claimed");
    }
  }
}
