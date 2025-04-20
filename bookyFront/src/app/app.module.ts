import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material Imports
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

// QR Code Module
import { QRCodeModule } from 'angularx-qrcode';

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
import { ReclamationUpdateComponent } from './components/reclamation-update/reclamation-update.component';
import { ReclamationAddComponent } from './components/reclamation-add/reclamation-add.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { DashboardComponent } from './components/dashborad/dashborad.component';
import { PageBooksComponent } from './components/page-books/page-books.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { DashSidebarComponent } from './components/dash-sidebar/dash-sidebar.component';
import { CartBackComponent } from './components/cart-back/cart-back.component';
import { ListBooksComponent } from './components/list-books/list-books.component';
import { UpdateBookComponent } from './components/update-book/update-book.component';
import { LayoutUpdateAddComponent } from './layouts/layout-update-add/layout-update-add.component';
import { CustomSnackBarComponent } from './components/custom-snack-bar/custom-snack-bar.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { PaymentBackComponent } from './components/payment-back/payment-back.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { ReclamationDetailsComponent } from './components/reclamation-details/reclamation-details.component';
import { ReclamationListComponent } from './components/reclamation-list/reclamation-list.component';
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
    AddBookComponent,
    DashboardComponent,
    PageBooksComponent,
    NavbarComponent,
    HomeComponent,
    CartComponent,
    FooterComponent,
    MainLayoutComponent,
    BlankLayoutComponent,
    DashSidebarComponent,
    CartBackComponent,
    ListBooksComponent,
    UpdateBookComponent,
    LayoutUpdateAddComponent,
    CustomSnackBarComponent,
    BookDetailsComponent,
    PaymentBackComponent,
    PaymentSuccessComponent,
    ReclamationDetailsComponent,
    ReclamationListComponent,
    ReclamationAddComponent,
    ReclamationUpdateComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // Angular Material Modules
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    // QR Code Module
    QRCodeModule,
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }




