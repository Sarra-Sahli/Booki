import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { EmailService } from '../services/email.service';

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
    private emailService: EmailService,
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
          console.log('[SignUpFormComponent] Registration successful, response:', response);
          this.successMessage = 'Registration successful! Please check your email to verify your account.';

          // Log email verification information
          console.log('[SignUpFormComponent] Email verification should be sent to:', userData.email);

          // Store email in localStorage temporarily for resend functionality
          localStorage.setItem('pending_verification_email', userData.email);

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 5000);
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

  /**
   * Resend verification email to the user
   */
  resendVerificationEmail(): void {
    const email = this.signUpForm.get('email')?.value || localStorage.getItem('pending_verification_email');

    if (!email) {
      this.errorMessages['general'] = 'Email address is missing. Please enter your email address.';
      return;
    }

    this.isLoading = true;
    this.errorMessages = {};
    console.log('[SignUpFormComponent] Resending verification email to:', email);

    this.emailService.resendVerificationEmail(email).subscribe({
      next: (response) => {
        console.log('[SignUpFormComponent] Verification email resent successfully:', response);
        this.successMessage = 'Verification email has been resent. Please check your inbox.';
        this.isLoading = false;
      },
      error: (error) => {
        console.error('[SignUpFormComponent] Failed to resend verification email:', error);
        this.isLoading = false;
        this.errorMessages['general'] = error.message || 'Failed to resend verification email. Please try again later.';
      }
    });
  }
}