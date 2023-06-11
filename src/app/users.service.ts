import { Injectable, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { CollectionReference, collection, where, query, getDocs } from 'firebase/firestore';
import { UserData } from 'src/interfaces/UserData';

@Injectable({
  providedIn: 'root'
})
export class UsersService implements OnInit {
  usersRef: CollectionReference;

  constructor(private firestore: Firestore) { 
    this.usersRef = collection(this.firestore, "users");
  }

  ngOnInit(): void {
    
  }

  async searchUsers(username: string) {
    const users: UserData[] = [];
    const q = query(this.usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc: any) => {
      users.push(doc.data());
    })
    return users;
  }
}
