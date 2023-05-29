import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { capitalize } from '../helpers';

@Component({
  selector: 'app-form-control',
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.scss']
})
export class FormControlComponent implements OnInit, OnChanges {
  @Input('appForm') form!: FormGroup;
  @Input('appSubmitted') submitted = false;
  @Input('appType') type!: "username" | "password" | "confirmPw"
  @Input() minLength = 6;
  // Reference to this form control (created and added to form group after OnInit runs)
  formControl?: FormControl;
  errMsg = '';
  isFocused = false;

  capitalize = capitalize;

  constructor(
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    switch (this.type) {
      case "username":
        this.form.addControl(this.type, new FormControl('', [Validators.required]))
        break;
      case "password":
        this.form.addControl(this.type, new FormControl('',
                [Validators.required, Validators.minLength(this.minLength)]))
        break;
      case "confirmPw":
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
    if (!str) {
      this.errMsg = "Required";
    } else if (str.length < this.minLength) {
      this.errMsg = `${capitalize(this.type)} must be ${this.minLength} characters or longer`;
    }
  }

  isValid(): boolean {
    return this.formControl!.valid;
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
  }
}
