import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css']
})
export class SignUpFormComponent {
  signUpForm: FormGroup;
  agreeTerms: boolean = false;
  errorMessages: { [key: string]: string } = {};
  isLoading = false;
  successMessage: string | null = null;
  passwordStrength = 0;
  strengthMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { 
      validators: this.passwordMatchValidator 
    });

    this.signUpForm.get('password')?.valueChanges.subscribe(() => {
      this.checkPasswordStrength();
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  checkPasswordStrength() {
    const password = this.signUpForm.get('password')?.value;
    if (password) {
      const result = this.authService.validatePassword(password);
      this.passwordStrength = result.strength;
      this.strengthMessage = result.message;
    } else {
      this.passwordStrength = 0;
      this.strengthMessage = '';
    }
  }

  toggleAgreeTerms(): void {
    this.agreeTerms = !this.agreeTerms;
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit(): void {
    if (this.signUpForm.valid && this.agreeTerms) {
      this.isLoading = true;
      this.errorMessages = {};
      
      const formData = this.signUpForm.value;
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };
      
      this.authService.register(userData).subscribe({
        next: (response) => {
          this.successMessage = 'Registration successful! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          if (typeof error === 'object') {
            this.errorMessages = error;
          } else {
            this.errorMessages['general'] = error;
          }
          for (const field in this.errorMessages) {
            if (this.signUpForm.get(field)) {
              this.signUpForm.get(field)?.setErrors({'serverError': true});
            }
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.signUpForm.markAllAsTouched();
      if (!this.agreeTerms) {
        this.errorMessages['terms'] = 'You must agree to the terms and conditions';
      }
    }
  }
}