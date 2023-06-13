import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from 'firebase/auth';
import { AuthService } from '../auth.service';
import { signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit{
  user?: User | null;
  userAvatarURL = '';
  isLoading = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private storage: StorageService
  ) { }

  ngOnInit(): void {
    this.authService.getAuth$().subscribe((currentUser) => {
      this.isLoading = false;
      this.user = currentUser;
      // console.log('woohoo', this.user);
      this.storage.getDownloadUrl('/app/default_avatar.jpg')
        .then((url) => this.userAvatarURL = url)
    })
  }

  logoutUser(): void {
    this.router.navigate(['/login']);
    this.user = null;
    signOut(this.authService.getAuth());
  }
}
