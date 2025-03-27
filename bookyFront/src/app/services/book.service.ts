import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/Books';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8095';

  constructor(private http: HttpClient) { }
  addBook(book: Book): Observable<Book> {
    // Transformation si nécessaire
    const apiBook = {
      ...book,
      publicationDate: book.publicationDate || new Date().toISOString()
    };
    
    return this.http.post<Book>(`${this.apiUrl}/AjoutLivre`, apiBook);
  }
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/ShowAllLivre`);
  }

  deleteLivre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteLivre/${id}`);
  }

}