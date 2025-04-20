import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-component',
  templateUrl: './admin-component.component.html',
  styleUrls: ['./admin-component.component.css']
})
export class AdminComponentComponent implements OnInit {
  users$ = this.auth.getUsers();
  users: any[] = []; // Add this line to define the users property

  constructor(private auth: AuthService) {}

  ngOnInit() {
    if (!this.auth.hasRole('ROLE_ADMIN')) {
      this.auth.redirectBasedOnRole();
      return;
    }

    console.log('Stored token:', localStorage.getItem('access_token'));
    console.log('Stored roles:', localStorage.getItem('roles'));
    
    this.auth.getUsers().subscribe({
      next: (users) => {
        console.log('Users retrieved successfully:', users);
        this.users = users;
      },
      error: (error) => {
        console.error('Error retrieving users:', error);
        console.log('Error response:', error.error);
        console.log('Error status:', error.status);
        console.log('Error headers:', error.headers);
      }
    });
  }
}

