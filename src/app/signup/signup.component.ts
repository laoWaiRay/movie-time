import { Component, Input, OnInit } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { Subject } from 'rxjs';
import { FormData } from 'src/interfaces/FormData';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  emailError$ = new Subject<string>();

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    const userCollection = collection(this.firestore, 'users');
    collectionData(userCollection).subscribe((data) => console.log(data))
  }

  async signUpUser(data: FormData) {
    console.log(data)
    const usersRef = collection(this.firestore, "users");
    const q = query(usersRef, where("email", "==", data.email));
    const querySnapshot = await getDocs(q);
    // // If # of docs matching email is 0, create a new account
    if (querySnapshot.size === 0) {
      await setDoc(doc(this.firestore, "users", data.email), {
        email: data.email,
        username: data.username,
        moviesWatched: [],
        moviesWanted: [],
        friends: [],
        favoriteMovies: []
      })
      console.log('successful sign up');
    } else {
      console.log('user already exists in db');
      this.emailError$.next("Already taken");
    }
  }
}
