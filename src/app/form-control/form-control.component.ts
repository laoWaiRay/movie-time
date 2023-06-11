import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, 
         ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UuidService } from '../uuid.service';
import { PasswordMatchValidator } from '../password-match-validator.directive';
import { FieldData } from 'src/interfaces/FieldData';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { UsersService } from '../users.service';

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
  emailDbErr = false;
  @Input() emailError$?: Observable<string>;
  isFocused = false;
  isPwHidden = true;
  usernameSearchTerms$ = new Subject<string>();
  usernameErr = false;

  @Output() newDataEvent = new EventEmitter<FieldData>();

  constructor(
    private uuid: UuidService,
    private el: ElementRef,
    private usersService: UsersService
  ) {
    this.id = this.uuid.getId();
  }

  ngOnInit(): void {
    // Create the form control and set Validators based on type of control needed
    switch (this.type) {
      case "email":
        this.labelName = "Email";
        // Simple regex for email
        this.form.addControl(this.type, new FormControl('', 
                [Validators.required, Validators.pattern('.+\@.+\..+')]));

        // Listens for form submissions and sets error msg if email is already taken
        this.emailError$?.subscribe((error) => {
          if (error) {
            this.emailDbErr = true;
            this.errMsg = error;
          }
        });
        break;
      case "username":
        this.labelName = "Username";
        this.form.addControl(this.type, new FormControl('', [Validators.required]))
        // Live username availability checking
        this.usernameSearchTerms$.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((term: string) => this.usersService.searchUsers(term))
        ).subscribe(users => {
          if (users.length > 0) {
            this.usernameErr = true;
            this.errMsg = "This username has already been claimed"
          }
          else
            this.usernameErr = false;
        });
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
    if (changes['submitted']?.currentValue === true) {
        this.setErrMsg(this.formControl?.value);
    }
  }

  setErrMsg(str: string): void {
    if (!str) {
      this.errMsg = "Required";
      return;
    }

    // Remove DB errors
    this.emailDbErr = false;
    
    // Set error messages according to the type of the formControl
    switch (this.type) {
      case ("email"):
        if (this.formControl?.errors?.['pattern'])
          this.errMsg = "Please enter a valid email";
        break;
      case ("password"):
        // Minimum length
        if (str.length < this.minLength)
          this.errMsg = `Password must be ${this.minLength} characters or longer`;
        break;
      case ("confirmPw"):       
        // Minimum length
        if (str.length < this.minLength)
          this.errMsg = `Password must be ${this.minLength} characters or longer`;
        // Check passwords match
        else if (this.form.errors?.['passwordMatch'])
          this.errMsg = "Passwords must match";
        break;
    }
  }

  isValid(): boolean {
    if (this.emailDbErr || this.usernameErr)
      return false;

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

  toggleHidePw(): void {
    this.isPwHidden = !this.isPwHidden;
    const inputRef = this.el.nativeElement.querySelector('input');
    if (this.isPwHidden)
      inputRef.type = "password";
    else 
      inputRef.type = "text";
    inputRef.focus();
  }

  emitValue(): void {
    this.newDataEvent.emit({
      dataType: this.type,
      data: this.formControl!.value
    });
  }

  validateUsername(username: string): void {
    if (this.type !== 'username')
      return
    this.usernameSearchTerms$.next(username);
  }
}
