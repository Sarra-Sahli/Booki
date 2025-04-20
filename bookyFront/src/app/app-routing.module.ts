import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { AdminComponentComponent } from './admin-component/admin-component.component';
import { AuthguardService } from './services/authguard.service';

const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignUpPageComponent },
  { path: 'home', component: HomeComponentComponent },
  { 
    path: 'admin/users', 
    component: AdminComponentComponent,
    canActivate: [AuthguardService],
    data: { roles: ['ROLE_ADMIN'] }
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
