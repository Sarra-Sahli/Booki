import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:8081/api/auth'; // Use the same gateway URL as auth service

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Request email verification for a user
   * @param email The email address to verify
   */
  requestEmailVerification(email: string): Observable<any> {
    console.log('[EmailService] Requesting email verification for:', email);
    
    return this.http.post(
      `${this.apiUrl}/request-verification`,
      { email },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(
      tap(response => {
        console.log('[EmailService] Email verification request successful:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('[EmailService] Email verification request failed:', error);
        
        let errorMessage = 'Failed to send verification email';
        if (error.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your internet connection.';
          console.error(`[EmailService] ${errorMessage}`);
        } else if (error.error?.message) {
          errorMessage = error.error.message;
          console.error(`[EmailService] ${errorMessage}`);
        }
        
        return throwError(() => ({
          message: errorMessage,
          status: error.status
        }));
      })
    );
  }

  /**
   * Verify email with token
   * @param token The verification token received via email
   */
  verifyEmail(token: string): Observable<any> {
    console.log('[EmailService] Verifying email with token');
    
    return this.http.post(
      `${this.apiUrl}/verify-email`,
      { token },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(
      tap(response => {
        console.log('[EmailService] Email verification successful:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('[EmailService] Email verification failed:', error);
        
        let errorMessage = 'Failed to verify email';
        if (error.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your internet connection.';
          console.error(`[EmailService] ${errorMessage}`);
        } else if (error.status === 400) {
          errorMessage = 'Invalid or expired verification token';
          console.error(`[EmailService] ${errorMessage}`);
        } else if (error.error?.message) {
          errorMessage = error.error.message;
          console.error(`[EmailService] ${errorMessage}`);
        }
        
        return throwError(() => ({
          message: errorMessage,
          status: error.status
        }));
      })
    );
  }

  /**
   * Resend verification email
   * @param email The email address to send verification to
   */
  resendVerificationEmail(email: string): Observable<any> {
    console.log('[EmailService] Resending verification email to:', email);
    
    return this.http.post(
      `${this.apiUrl}/resend-verification`,
      { email },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(
      tap(response => {
        console.log('[EmailService] Verification email resent successfully:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('[EmailService] Failed to resend verification email:', error);
        
        let errorMessage = 'Failed to resend verification email';
        if (error.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your internet connection.';
          console.error(`[EmailService] ${errorMessage}`);
        } else if (error.error?.message) {
          errorMessage = error.error.message;
          console.error(`[EmailService] ${errorMessage}`);
        }
        
        return throwError(() => ({
          message: errorMessage,
          status: error.status
        }));
      })
    );
  }

  /**
   * Check if an email is verified
   * @param email The email to check verification status
   */
  checkEmailVerificationStatus(email: string): Observable<any> {
    console.log('[EmailService] Checking verification status for email:', email);
    
    return this.http.get(
      `${this.apiUrl}/verification-status?email=${encodeURIComponent(email)}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(
      tap(response => {
        console.log('[EmailService] Email verification status:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('[EmailService] Failed to check email verification status:', error);
        
        let errorMessage = 'Failed to check email verification status';
        if (error.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your internet connection.';
          console.error(`[EmailService] ${errorMessage}`);
        } else if (error.error?.message) {
          errorMessage = error.error.message;
          console.error(`[EmailService] ${errorMessage}`);
        }
        
        return throwError(() => ({
          message: errorMessage,
          status: error.status
        }));
      })
    );
  }
}
