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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { 
      validators: this.passwordMatchValidator 
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

  toggleAgreeTerms(): void {
    this.agreeTerms = !this.agreeTerms;
  }

  onSubmit(): void {
    console.log('Form submission started');
    
    if (this.signUpForm.valid && this.agreeTerms) {
      this.isLoading = true;
      this.errorMessages = {}; // Reset error messages
      
      const formData = this.signUpForm.value;
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };
      
      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.successMessage = 'Registration successful! Redirecting to login...';
          
          // Redirect after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.isLoading = false;
          
          // Map errors to form fields
          if (typeof error === 'object') {
            this.errorMessages = error;
          } else {
            this.errorMessages['general'] = error;
          }
          
          // Highlight problematic fields
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
      
      // Add error if terms not agreed
      if (!this.agreeTerms) {
        this.errorMessages['terms'] = 'You must agree to the terms and conditions';
      }
    }
  }
}