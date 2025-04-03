import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBookComponent } from './components/add-book/add-book.component';
import { PageBooksComponent } from './components/page-books/page-books.component';
import { CartComponent } from './components/cart/cart.component';
import { HomeComponent } from './components/home/home.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { CartBackComponent } from './components/cart-back/cart-back.component';
import { ListBooksComponent } from './components/list-books/list-books.component';
import { LayoutUpdateAddComponent } from './layouts/layout-update-add/layout-update-add.component';
import { UpdateBookComponent } from './components/update-book/update-book.component';
import { DashboardComponent } from './components/dashborad/dashborad.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent, // Contains navbar and footer
    children: [
      { path: 'books', component: PageBooksComponent },
      { path: 'cart', component: CartComponent },
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: '/home', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    component: BlankLayoutComponent, // No navbar or footer
    children: [

      { path: 'dashboard', component: DashboardComponent},
      { path: 'bookList', component: ListBooksComponent },
      { path: 'carts', component:CartBackComponent },
      { path: 'books/:id', component: PageBooksComponent }, // Route pour les détails d'un livre


    ]
  },
  {
    path: '',
    component: LayoutUpdateAddComponent, // No navbar or footer
    children: [

      { path: 'add-book', component: AddBookComponent },
      { 
        path: 'update-book/:id', // Route avec paramètre ID
        component: UpdateBookComponent
      },


    ]
  }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }