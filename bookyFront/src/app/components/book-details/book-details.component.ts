import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../../models/Books';
import { BookService } from '../../services/book.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

const API_BASE_URL = 'http://localhost:8095';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book: Book | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadBook(id);
    });
  }

  loadBook(id: number): void {
    this.loading = true;
    this.bookService.getBookById(id).subscribe({
      next: (book) => {
        this.book = book;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement du livre';
        this.loading = false;
        console.error('Erreur:', error);
      }
    });
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return 'assets/images/default-book.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_BASE_URL}/uploads/${imageUrl}`;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/default-book.jpg';
  }
}
