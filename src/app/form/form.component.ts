import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  loginForm: any = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  ngOnInit(): void {
    switch(this.formType) {
      case "signup":
        this.title = "Register"
        this.titleMsg = "Sign up for a new account"
        this.helpMsg = "Already have an account?"
        this.linkMsg = "Sign In"
        this.loginForm.setControl('confirmPassword', new FormControl('', [Validators.required]));
        break;
      case "login":
        this.title = "Login"
        this.titleMsg = "Sign in to continue"
        this.helpMsg = "Don't have an account?"
        this.linkMsg = "Sign Up"
        break;
    }
  }

  onSubmit():void {
    this.isSubmitted = true;
    console.log(this.loginForm);
  }
}
