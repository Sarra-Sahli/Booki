import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css']
})
export class SignUpFormComponent implements OnInit {
  signUpForm: FormGroup;
  agreeTerms: boolean = false;

  constructor(private fb: FormBuilder) {
    this.signUpForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  toggleAgreeTerms(): void {
    this.agreeTerms = !this.agreeTerms;
  }

  onSubmit(): void {
    if (this.signUpForm.valid && this.agreeTerms) {
      console.log('Form submitted', this.signUpForm.value);
      // Add your registration logic here
    } else {
      this.signUpForm.markAllAsTouched();
    }
  }

}
