import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBookComponent } from './add-book/add-book.component';
import { DashboardComponent } from './dashborad/dashborad.component';

const routes: Routes = [
  { path: 'add-book', component: AddBookComponent },
  { path: 'dashboard', component: DashboardComponent },
  { 
    path: '', 
    redirectTo: '/dashboard', 
    pathMatch: 'full' // Redirection vers le dashboard par défaut
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
