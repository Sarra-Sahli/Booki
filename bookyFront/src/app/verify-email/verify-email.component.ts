import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailService } from '../services/email.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  isLoading = true;
  isVerified = false;
  errorMessage: string | null = null;
  email: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    // Get token from URL
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      this.email = params['email'];
      
      if (!token) {
        console.error('[VerifyEmailComponent] No verification token provided in URL');
        this.isLoading = false;
        this.errorMessage = 'No verification token provided. Please check your email link.';
        return;
      }
      
      console.log('[VerifyEmailComponent] Verifying email with token');
      this.verifyEmail(token);
    });
  }

  verifyEmail(token: string): void {
    this.emailService.verifyEmail(token).subscribe({
      next: (response) => {
        console.log('[VerifyEmailComponent] Email verification successful:', response);
        this.isLoading = false;
        this.isVerified = true;
      },
      error: (error) => {
        console.error('[VerifyEmailComponent] Email verification failed:', error);
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to verify email. The token may be invalid or expired.';
      }
    });
  }

  resendVerification(): void {
    if (!this.email) {
      this.errorMessage = 'Email address is missing. Please try the original verification link from your email.';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = null;
    
    console.log('[VerifyEmailComponent] Resending verification email to:', this.email);
    this.emailService.resendVerificationEmail(this.email).subscribe({
      next: (response) => {
        console.log('[VerifyEmailComponent] Verification email resent successfully');
        this.isLoading = false;
        this.errorMessage = null;
        // Show success message
        alert('Verification email has been resent. Please check your inbox.');
      },
      error: (error) => {
        console.error('[VerifyEmailComponent] Failed to resend verification email:', error);
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to resend verification email. Please try again later.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
