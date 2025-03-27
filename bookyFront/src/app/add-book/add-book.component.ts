import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { Book } from '../models/Books';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent {
  book: Book = {
    title: '',
    author: '',
    genre: 'ROMANCE',
    price: 0,
    available: true,
    publicationDate: new Date().toISOString() // Convertit en string
  };

  constructor(
    private bookService: BookService,
    private router: Router
  ) {}

  onSubmit() {
    this.bookService.addBook(this.book).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout:', err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}