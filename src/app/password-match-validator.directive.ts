import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const PasswordMatchValidator: ValidatorFn = (control: AbstractControl)
    : ValidationErrors | null => {
  const password = control.get('password');
  const confirm = control.get('confirmPw');

  return password!.value !== confirm!.value ? { passwordMatch: true } : null;
}