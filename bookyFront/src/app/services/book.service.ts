import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/Books';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8095'; // Assurez-vous que c'est le bon port

  constructor(private http: HttpClient) { }

  // Méthode pour uploader l'image
  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post(`${this.apiUrl}/upload`, formData, {
      responseType: 'text'
    });
}

  getUploadUrl(): string {
    return `${this.apiUrl}/upload`;
  }

  // Méthode pour ajouter un livre
  addBook(book: Book): Observable<Book> {
    const apiBook = {
      ...book,
      publicationDate: book.publicationDate || new Date().toISOString()
    };
    return this.http.post<Book>(`${this.apiUrl}/AjoutLivre`, apiBook);
  }

  // Méthodes existantes inchangées
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/ShowAllLivre`);
  }

  deleteLivre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteLivre/${id}`);
  }
}