import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { WelcomeSectionComponent } from './welcome-section/welcome-section.component';
import { SignUpFormComponent } from './sign-up-form/sign-up-form.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './services/interceptor.service';
import { HomeComponentComponent } from './home-component/home-component.component';
import { AdminComponentComponent } from './admin-component/admin-component.component';
import { PasswordStrengthComponent } from './password-strength/password-strength.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { EmailService } from './services/email.service';
export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    LoginFormComponent,
    WelcomeSectionComponent,
    SignUpFormComponent,
    SignUpPageComponent,
    HomeComponentComponent,
    AdminComponentComponent,
    PasswordStrengthComponent,
    VerifyEmailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:8083'],
        // Remove the signin route from disallowedRoutes since we need to send the token
        disallowedRoutes: []
      }
    })

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    EmailService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }




