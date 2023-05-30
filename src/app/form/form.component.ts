import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  @Input() formType: "login" | "signup" = "login";
  isSubmitted = false;

  title = ''
  titleMsg = ''
  helpMsg = ''
  linkMsg = ''
  link = ''

  loginForm: any = new FormGroup({});

  ngOnInit(): void {
    switch(this.formType) {
      case "signup":
        this.title = "Register"
        this.titleMsg = "Sign up for a new account"
        this.helpMsg = "Already have an account?"
        this.linkMsg = "Sign In"
        this.link = "/login"
        break;
      case "login":
        this.title = "Login"
        this.titleMsg = "Sign in to continue"
        this.helpMsg = "Don't have an account?"
        this.linkMsg = "Sign Up"
        this.link = "/signup"
        break;
    }
  }

  onSubmit():void {
    this.isSubmitted = true;
  }
}
