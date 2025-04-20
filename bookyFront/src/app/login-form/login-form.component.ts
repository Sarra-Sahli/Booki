import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

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
          this.router.navigate(['/dashboard']);
        } else if (roles.includes('ROLE_USER')) {
          // Rediriger vers la page des livres au lieu de la page d'accueil
          this.router.navigate(['/books']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login error:', err);
        if (err.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check your internet connection.';
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
}

