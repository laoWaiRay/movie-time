import { Injectable, OnDestroy } from '@angular/core';
import { Auth, User, user, createUserWithEmailAndPassword, signInWithEmailAndPassword, Persistence } from '@angular/fire/auth';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  user$: Observable<User | null>;
  userSubscription: Subscription;
  currentUser: User | null;

  constructor(private auth: Auth) { 
    this.currentUser = auth.currentUser;
    
    this.user$ = user(auth);
    this.userSubscription = this.user$.subscribe((usr) => {
      this.currentUser = usr;
    })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  // Return true if login failed
  async loginEmailPassword(email: string, password: string): Promise<boolean> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log(userCredential);
      return false;
    } catch (error) {
      console.log(error);
      return true;
    }
  }

  // Return true if account creation failed
  async createAccount(email: string, password: string): Promise<boolean> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log(userCredential);
      return false;
    } catch (error) {
      console.log(error);
      return true;
    }
  }

  getAuth() {
    return this.auth;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getAuth$(): Observable<User | null>{
    return this.user$;
  }
}
