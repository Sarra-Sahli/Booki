import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthguardService implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Check both authentication and token validity
    if (!this.auth.isAuthenticated() || this.auth.isTokenExpired()) {
      this.auth.logout();
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: route.url }
      });
      return false;
    }

    const requiredRoles = route.data['roles'] as Array<string>;
    if (requiredRoles && !requiredRoles.some(r => this.auth.hasRole(r))) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}