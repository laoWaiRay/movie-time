import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UuidService } from '../uuid.service';
import { PasswordMatchValidator } from '../password-match-validator.directive';

@Component({
  selector: 'app-form-control',
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.scss']
})
export class FormControlComponent implements OnInit, OnChanges {
  @Input('appForm') form!: FormGroup;
  @Input('appSubmitted') submitted = false;
  @Input('appType') type!: "email" | "username" | "password" | "confirmPw"
  @Input() minLength = 6;
  // Reference to this form control (created and added to form group after OnInit runs)
  id = '';
  formControl?: FormControl;
  labelName = '';
  errMsg = '';
  isFocused = false;

  constructor(
    private el: ElementRef,
    private uuid: UuidService
  ) {
    this.id = this.uuid.getId();
  }

  ngOnInit(): void {
    // Create the form control and set Validators based on type of control needed
    switch (this.type) {
      case "email":
        this.labelName = "Email";
        this.form.addControl(this.type, new FormControl('', 
                [Validators.required, Validators.email]))
        break;
      case "username":
        this.labelName = "Username";
        this.form.addControl(this.type, new FormControl('', [Validators.required]))
        break;
      case "password":
        this.labelName = "Password"
        this.form.addControl(this.type, new FormControl('',
                [Validators.required, Validators.minLength(this.minLength)]))
        break;
      case "confirmPw":
        this.labelName = "Confirm Password"
        this.form.addControl(this.type, new FormControl('',
                [Validators.required, Validators.minLength(this.minLength)]))
        this.form.addValidators(PasswordMatchValidator);
        break;
    }

    this.formControl = this.form.get(this.type) as FormControl;
    this.formControl!.valueChanges.subscribe((val) => this.setErrMsg(val));
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Update Error Message whenever the form is submitted
    if (changes['submitted'].currentValue === true) {
      this.setErrMsg(this.el.nativeElement.value);
    }
  }

  setErrMsg(str: string): void {
    // Since all fields are required just put this here
    if (!str) {
      this.errMsg = "Required";
      return;
    }
    
    // Set error messages according to the type of the formControl
    switch (this.type) {
      case ("email"):
        if (this.formControl?.errors?.['email'])
          this.errMsg = "Please enter a valid email"
        break;
      case ("password"):
        // Minimum length
        if (str.length < this.minLength) {
          this.errMsg = `Password must be ${this.minLength} characters or longer`;
        } 
        break;
      case ("confirmPw"):
        // Minimum length
        if (str.length < this.minLength) {
          this.errMsg = `Password must be ${this.minLength} characters or longer`;

          // Check passwords match
        } else if (this.form.errors?.['passwordMatch']) {
          this.errMsg = "Passwords must match";
        }
        break;
    }
  }

  isValid(): boolean {
    // Slightly different check if it is a 'confirmPw' formControl
    if (this.type === ("confirmPw")) {
      return this.formControl!.valid && !this.form.errors;
    }

    return this.formControl!.valid;
  }

  isFormValid(): boolean {
    return this.form.errors ? false : true;
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
  }
}
