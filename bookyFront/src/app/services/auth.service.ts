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
          throw new Error('No token received');
        }
        this.storeAuthData(response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login error:', error);
        let errorMessage = 'Login failed';
        
        if (error.status === 401) {
          errorMessage = 'Invalid username or password';
        } else if (error.status === 0) {
          errorMessage = 'Cannot connect to server';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
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
    
    if (roles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/admin/users']);
    } else {
      this.router.navigate(['/welcome']);
    }
  }

  // Add this new method for admin to get users
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8083/api/users`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      }),
      withCredentials: true
    });
  }


  register(userData: {
    username: string;
    email: string;
    password: string;
    roles?: string[];
  }): Observable<any> {
    const payload = {
      ...userData,
      
      roles: userData.roles || ['user']
    };
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    // Remove withCredentials for signup
    return this.http.post(`${this.apiUrl}/signup`, payload, { 
      headers: headers
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';
        const errors: {[key: string]: string} = {};
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
          errors['general'] = errorMessage;
        } else {
          // Server-side error
          if (error.status === 400) {
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
          } else {
            errors['general'] = error.message || 'Registration failed';
          }
        }
        
        return throwError(() => errors);
      })
    );
  }


  private storeAuthData(authData: LoginResponse): void {
    localStorage.setItem('access_token', authData.token);
    localStorage.setItem('user_id', authData.id.toString());
    localStorage.setItem('username', authData.username);
    localStorage.setItem('roles', JSON.stringify(authData.roles));
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUserRoles(): string[] {
    const rolesStr = localStorage.getItem('roles');
    if (!rolesStr) return [];
    try {
      return JSON.parse(rolesStr);
    } catch (e) {
      console.error('Error parsing roles:', e);
      return [];
    }
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  // Add proper role checking
  hasRole(role: string): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.roles?.includes(role) || false;
  }
}
