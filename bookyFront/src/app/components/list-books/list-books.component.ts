import { Component } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-list-books',
  templateUrl: './list-books.component.html',
  styleUrls: ['./list-books.component.css']
})
export class ListBooksComponent {


   books: any[] = [];
    filteredBooks: any[] = [];
    searchTerm: string = '';
  
    constructor(private bookService: BookService) {}
  
    ngOnInit(): void {
      this.loadBooks();
    }
  
    
  
    loadBooks(): void {
      this.bookService.getBooks().subscribe(
        (data) => {
          this.books = data;
          this.filteredBooks = [...data]; // Utilisation de spread operator pour éviter les références
        },
        (error) => console.error('Erreur lors du chargement des livres', error)
      );
    }
  
    getImageUrl(imagePath: string): string {
      if (imagePath.startsWith('http')) {
        return imagePath; // Si c'est déjà une URL complète
      }
      // Adaptez cette URL selon votre configuration backend
      return `${environment.apiUrl}/uploads/${imagePath}`;
    }
  
    deleteLivre(id: number): void { // Correction du nom de la fonction
      console.log("Suppression du livre avec ID:", id);  
      
      if (confirm('Voulez-vous vraiment supprimer ce livre ?')) {
        this.bookService.deleteLivre(id).subscribe(
          () => {
            // Mise à jour instantanée du tableau
            this.books = this.books.filter(book => book.id !== id);
            this.filteredBooks = this.filteredBooks.filter(book => book.id !== id);
            console.log(`Livre avec ID ${id} supprimé avec succès`);
          },
          (error) => console.error('Erreur lors de la suppression du livre', error)
        );
      }
    }
  
    applyFilter(): void {
      this.filteredBooks = this.books.filter(book =>
        book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

}
