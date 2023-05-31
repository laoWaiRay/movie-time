import { Component } from '@angular/core';
import { FormData } from 'src/interfaces/FormData';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  logData(data: FormData) {
    console.log(data);
  }
}
