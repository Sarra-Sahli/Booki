import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { EmailService } from '../services/email.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  loginForm: FormGroup;
  rememberMe: boolean = false;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private emailService: EmailService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // login-form.component.ts
onSubmit(): void {
  if (this.loginForm.valid) {
    this.isLoading = true;
    this.errorMessage = null;

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        const roles = response.roles;

        if (roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/admin/users']);
        } else if (roles.includes('ROLE_USER')) {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('[LoginFormComponent] Login error:', err);

        if (err.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check your internet connection.';
        } else if (err.status === 401 && err.error?.message?.includes('not verified')) {
          // Handle email not verified error
          console.log('[LoginFormComponent] Email not verified error');
          this.errorMessage = 'Your email has not been verified. Please check your inbox for the verification email.';

          // Get the email from the form or the error response
          const email = err.error?.email || this.loginForm.get('username')?.value;
          if (email) {
            localStorage.setItem('pending_verification_email', email);
          }
        } else {
          this.errorMessage = err.error?.message || 'Login failed. Please try again.';
        }
      }
    });
  }
}

  toggleRememberMe(): void {
    this.rememberMe = !this.rememberMe;
  }

  /**
   * Resend verification email to the user
   */
  resendVerificationEmail(): void {
    const email = localStorage.getItem('pending_verification_email');

    if (!email) {
      this.errorMessage = 'Email address is missing. Please try logging in again.';
      return;
    }

    this.isLoading = true;
    console.log('[LoginFormComponent] Resending verification email to:', email);

    this.emailService.resendVerificationEmail(email).subscribe({
      next: (response) => {
        console.log('[LoginFormComponent] Verification email resent successfully:', response);
        this.errorMessage = 'Verification email has been resent. Please check your inbox.';
        this.isLoading = false;
      },
      error: (error) => {
        console.error('[LoginFormComponent] Failed to resend verification email:', error);
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to resend verification email. Please try again later.';
      }
    });
  }
}

