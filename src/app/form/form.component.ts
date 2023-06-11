import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { FieldData } from 'src/interfaces/FieldData';
import { FormData } from 'src/interfaces/FormData';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  @Input() formType: "login" | "signup" = "login";
  @Input() emailError$?: Observable<string>;
  @Input() loginFormErrMsg = '';
  isSubmitted = false;

  title = ''
  titleMsg = ''
  helpMsg = ''
  linkMsg = ''
  link = ''

  formGroup: any = new FormGroup({});

  formData: FormData = {} as FormData;

  @Output() newDataEvent = new EventEmitter<FormData>();

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

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.formGroup.valid) {
      this.newDataEvent.emit(this.formData);
    }
  }

  updateData(data: FieldData): void {
    this.formData[data.dataType] = data.data;
  }
}
