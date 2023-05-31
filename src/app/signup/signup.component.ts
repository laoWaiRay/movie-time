import { Component, Input, OnInit } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { FormData } from 'src/interfaces/FormData';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  // @Input() signupData

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    // const userCollection = collection(this.firestore, 'users');
    // collectionData(userCollection).subscribe((data) => console.log(data))
  }

  async signUpUser(data: FormData) {
    const usersRef = collection(this.firestore, "users");
    const q = query(usersRef, where("email", "==", data.email[0]));
    const querySnapshot = await getDocs(q);
    // If # of docs matching email is 0, create a new account
    if (querySnapshot.size === 0) {
      await setDoc(doc(this.firestore, "users", data.email[0]), {
        email: data.email[0],
        username: data.username![0],
        moviesWatched: [],
        moviesWanted: [],
        friends: [],
        favoriteMovies: []
      })
    }
  }
}
