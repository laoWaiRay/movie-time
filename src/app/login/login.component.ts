import { Component } from '@angular/core';
import { FormData } from 'src/interfaces/FormData';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  errMsg = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async login(data: FormData) {
    const err = await this.authService.loginEmailPassword(data.email, data.password);
    if (err) {
      this.errMsg = 'Invalid credentials - please try again';
    } else {
      this.router.navigate(['/']);
    }
  }
}
