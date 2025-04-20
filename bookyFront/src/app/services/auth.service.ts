import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

interface LoginResponse {
  token: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth'; // Gateway URL
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<LoginResponse> {
    console.log('[AuthService] Login attempt for user:', username);
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/signin`,
      { username, password },
      {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(
      tap(response => {
        if (!response?.token) {
          console.error('[AuthService] Login failed: No token received');
          throw new Error('No token received');
        }
        console.log('[AuthService] Login successful for user:', username);
        console.log('[AuthService] User roles:', response.roles);
        this.storeAuthData(response);
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Login failed';

        if (error.status === 401) {
          errorMessage = 'Invalid username or password';
          console.error(`[AuthService] Login failed: ${errorMessage}`);
        } else if (error.status === 0) {
          errorMessage = 'Cannot connect to server';
          console.error(`[AuthService] Login failed: ${errorMessage}`);
        } else if (error.error?.message) {
          errorMessage = error.error.message;
          console.error(`[AuthService] Login failed: ${errorMessage}`);
        } else {
          console.error('[AuthService] Login error:', error);
        }

        return throwError(() => ({
          message: errorMessage,
          status: error.status
        }));
      })
    );
  }


  redirectBasedOnRole(): void {
    const roles = this.getUserRoles();
    console.log('[AuthService] Redirecting based on roles:', roles);

    if (roles.includes('ROLE_ADMIN')) {
      console.log('[AuthService] Redirecting to admin dashboard');
      this.router.navigate(['/admin/users']);
    } else {
      console.log('[AuthService] Redirecting to welcome page');
      this.router.navigate(['/welcome']);
    }
  }

  // Add this new method for admin to get users
  getUsers(): Observable<any[]> {
    console.log('[AuthService] Fetching users list');
    return this.http.get<any[]>(`http://localhost:8083/api/users`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      }),
      withCredentials: true
    }).pipe(
      tap(users => {
        console.log(`[AuthService] Successfully retrieved ${users.length} users`);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('[AuthService] Error fetching users:', error);
        return throwError(() => error);
      })
    );
  }


  register(userData: {
    username: string;
    email: string;
    password: string;
    roles?: string[];
  }): Observable<any> {
    console.log('[AuthService] Registration attempt for user:', userData.username);
    console.log('[AuthService] Registration email:', userData.email);

    const payload = {
      ...userData,
      roles: userData.roles || ['user']
    };
    console.log('[AuthService] Registration payload:', { ...payload, password: '***REDACTED***' });

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Remove withCredentials for signup
    return this.http.post(`${this.apiUrl}/signup`, payload, {
      headers: headers
    }).pipe(
      tap(response => {
        console.log('[AuthService] Registration successful for user:', userData.username);
        console.log('[AuthService] Registration response:', response);
        console.log('[AuthService] Email verification should be sent to:', userData.email);
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';
        const errors: {[key: string]: string} = {};

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
          errors['general'] = errorMessage;
          console.error('[AuthService] Registration client-side error:', errorMessage);
        } else {
          // Server-side error
          console.error('[AuthService] Registration server-side error:', error);

          if (error.status === 400) {
            console.error('[AuthService] Registration validation error:', error.error);
            // Handle validation errors
            if (typeof error.error === 'object') {
              // Map backend errors to form fields
              for (const key in error.error) {
                if (error.error.hasOwnProperty(key)) {
                  errors[key] = Array.isArray(error.error[key])
                    ? error.error[key].join(', ')
                    : error.error[key];
                }
              }
            } else {
              errors['general'] = error.error;
            }
          } else if (error.status === 0) {
            errors['general'] = 'Could not connect to server. Please try again later.';
            console.error('[AuthService] Registration connection error: Could not connect to server');
          } else {
            errors['general'] = error.message || 'Registration failed';
            console.error('[AuthService] Registration error:', errors['general']);
          }
        }

        return throwError(() => errors);
      })
    );
  }


  private storeAuthData(authData: LoginResponse): void {
    console.log('[AuthService] Storing auth data for user:', authData.username);
    localStorage.setItem('access_token', authData.token);
    localStorage.setItem('user_id', authData.id.toString());
    localStorage.setItem('username', authData.username);
    localStorage.setItem('roles', JSON.stringify(authData.roles));
    console.log('[AuthService] Auth data stored successfully');
  }

  logout(): void {
    const username = localStorage.getItem('username');
    console.log('[AuthService] Logging out user:', username);
    localStorage.clear();
    console.log('[AuthService] Local storage cleared');
    this.router.navigate(['/login']);
    console.log('[AuthService] Redirected to login page');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    const isAuth = token ? !this.jwtHelper.isTokenExpired(token) : false;
    console.log('[AuthService] Authentication check:', isAuth ? 'Authenticated' : 'Not authenticated');
    return isAuth;
  }

  getToken(): string | null {
    const token = localStorage.getItem('access_token');
    console.log('[AuthService] Token retrieved:', token ? 'Token exists' : 'No token found');
    return token;
  }

  getUserRoles(): string[] {
    const rolesStr = localStorage.getItem('roles');
    if (!rolesStr) {
      console.log('[AuthService] No roles found in localStorage');
      return [];
    }
    try {
      const roles = JSON.parse(rolesStr);
      console.log('[AuthService] User roles retrieved:', roles);
      return roles;
    } catch (e) {
      console.error('[AuthService] Error parsing roles:', e);
      return [];
    }
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      console.log('[AuthService] Token expired check: No token found');
      return true;
    }

    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    const currentTime = Math.floor((new Date).getTime() / 1000);
    const isExpired = currentTime >= expiry;

    if (isExpired) {
      console.log('[AuthService] Token is expired. Expiry:', new Date(expiry * 1000).toISOString());
    } else {
      const remainingTime = expiry - currentTime;
      console.log(`[AuthService] Token is valid. Expires in: ${Math.floor(remainingTime / 60)} minutes`);
    }

    return isExpired;
  }

  // Add proper role checking
  hasRole(role: string): boolean {
    const token = this.getToken();
    if (!token) {
      console.log(`[AuthService] Role check (${role}): No token found`);
      return false;
    }

    const decoded = JSON.parse(atob(token.split('.')[1]));
    const hasRole = decoded.roles?.includes(role) || false;
    console.log(`[AuthService] Role check: User ${hasRole ? 'has' : 'does not have'} role '${role}'`);
    console.log('[AuthService] User roles from token:', decoded.roles);
    return hasRole;
  }

validatePassword(password: string): { strength: number; message: string } {
  console.log('[AuthService] Validating password strength');
  let strength = 0;
  let message = '';
  let validations = [];

  // Length check
  if (password.length >= 8) {
    strength += 1;
    validations.push('Length ≥ 8');
  }

  // Contains numbers
  if (/\d/.test(password)) {
    strength += 1;
    validations.push('Has numbers');
  }

  // Contains uppercase
  if (/[A-Z]/.test(password)) {
    strength += 1;
    validations.push('Has uppercase');
  }

  // Contains lowercase
  if (/[a-z]/.test(password)) {
    strength += 1;
    validations.push('Has lowercase');
  }

  // Contains special chars
  if (/[^A-Za-z0-9]/.test(password)) {
    strength += 1;
    validations.push('Has special chars');
  }

  // Match these to your backend rules
  switch (strength) {
    case 0:
    case 1:
      message = 'Very Weak';
      break;
    case 2:
      message = 'Weak';
      break;
    case 3:
      message = 'Moderate';
      break;
    case 4:
      message = 'Strong';
      break;
    case 5:
      message = 'Very Strong';
      break;
  }

  console.log(`[AuthService] Password strength: ${message} (${(strength / 5) * 100}%)`);
  console.log('[AuthService] Password validations passed:', validations);

  return { strength: (strength / 5) * 100, message };
}
}
