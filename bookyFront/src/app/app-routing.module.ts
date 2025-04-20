import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { AdminComponentComponent } from './admin-component/admin-component.component';
import { AuthguardService } from './services/authguard.service';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { PageBooksComponent } from './components/page-books/page-books.component';
import { CartComponent } from './components/cart/cart.component';
import { HomeComponent } from './components/home/home.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { DashboardComponent } from './components/dashborad/dashborad.component';
import { ListBooksComponent } from './components/list-books/list-books.component';
import { CartBackComponent } from './components/cart-back/cart-back.component';
import { PaymentBackComponent } from './components/payment-back/payment-back.component';
import { ReclamationListComponent } from './components/reclamation-list/reclamation-list.component';
import { ReclamationDetailsComponent } from './components/reclamation-details/reclamation-details.component';
import { LayoutUpdateAddComponent } from './layouts/layout-update-add/layout-update-add.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { UpdateBookComponent } from './components/update-book/update-book.component';
import { ReclamationAddComponent } from './components/reclamation-add/reclamation-add.component';
import { ReclamationUpdateComponent } from './components/reclamation-update/reclamation-update.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';

const routes: Routes = [
  // Route par défaut - redirige vers la page de connexion
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Routes pour les pages principales avec navbar et footer
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthguardService], // Protection par authentification
    children: [
      { path: 'books', component: PageBooksComponent },
      { path: 'cart', component: CartComponent },
      { path: 'home', component: HomeComponent },
      {
        path: 'payment-success',
        component: PaymentSuccessComponent,
        data: { showSuccess: true }
      }
    ]
  },
  {
    path: '',
    component: BlankLayoutComponent, // No navbar or footer
    canActivate: [AuthguardService], // Protection par authentification
    children: [

      { path: 'dashboard', component: DashboardComponent},
      { path: 'bookList', component: ListBooksComponent },
      { path: 'carts', component: CartBackComponent },
      { path: 'books/:id', component: PageBooksComponent }, // Route pour les détails d'un livre
      { path: 'payments', component: PaymentBackComponent },
      { path: 'reclamations', component: ReclamationListComponent },
      { path: 'reclamation-details/:id', component: ReclamationDetailsComponent },

    ]
  },
  {
    path: '',
    component: LayoutUpdateAddComponent, // No navbar or footer
    canActivate: [AuthguardService], // Protection par authentification
    children: [

      { path: 'add-book', component: AddBookComponent },
      {
        path: 'update-book/:id', // Route avec paramètre ID
        component: UpdateBookComponent
      },
      { path: 'add-reclamation', component: ReclamationAddComponent },
      {
        path: 'update-reclamation/:id', // Route avec paramètre ID
        component: ReclamationUpdateComponent
      },

    ]
  },
  {
    path: 'book-details/:id',
    component: BookDetailsComponent,
    canActivate: [AuthguardService] // Protection par authentification
  },

  // Routes d'authentification
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignUpPageComponent },
  { path: 'home', component: HomeComponentComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthguardService],
    data: { roles: ['ROLE_ADMIN'] }
  },
  // Route fallback - redirige vers la page de connexion
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
