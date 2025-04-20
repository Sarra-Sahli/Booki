import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book, Language } from '../../models/Books';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent {
  book: Book = {
    title: '',
    author: '',
    genre: '',
    price: 0,
    originalPrice: 0,
    available: true,
    publicationDate: new Date().toISOString().split('T')[0],
    imageUrl: '',
    quantite: 0,
    language: Language.FRANCAIS,
    resume: ''
  };
  selectedFile: File | null = null;
  isSubmitting = false;
  uploadProgress = 0;

  constructor(
    private bookService: BookService,
    private router: Router
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Vérification du type de fichier
      if (!file.type.match('image.*')) {
        alert('Seules les images sont autorisées');
        return;
      }

      // Vérification de la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La taille maximale est de 5MB');
        return;
      }

      this.selectedFile = file;
      
      // Afficher un aperçu
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.book.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.isSubmitting || !this.isFormValid()) return;
    
    this.isSubmitting = true;
    this.uploadProgress = 0;

    if (this.selectedFile) {
      this.uploadImage();
    } else {
      this.addBook();
    }
  }

  private uploadImage(): void {
    if (!this.selectedFile) return;
  
    this.bookService.uploadImage(this.selectedFile).subscribe({
      next: (imageName) => {
        // Construire l'URL complète de l'image
        this.book.imageUrl = imageName;
        this.addBook();
      },
      error: (err) => {
        console.error('Erreur upload image:', err);
        this.resetUploadState();
        alert('Erreur lors de l\'upload de l\'image: ' + (err.error?.error || err.message));
      }
    });
  }

  private addBook(): void {
    // Convertir la date en format ISO string
    const date = new Date(this.book.publicationDate);
    this.book.publicationDate = date.toISOString().split('T')[0];
    
    // S'assurer que tous les champs requis sont présents
    const bookToSend = {
      ...this.book,
      available: this.book.available || false,
      quantite: this.book.quantite || 0,
      price: this.book.price || 0,
      originalPrice: this.book.price || 0
    };
    
    this.bookService.addBook(bookToSend).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Erreur ajout livre:', err);
        alert('Erreur lors de l\'ajout du livre: ' + (err.error?.error || err.message));
        this.resetUploadState();
      }
    });
  }

  private isFormValid(): boolean {
    return this.book.title.trim() !== '' && 
           this.book.author.trim() !== '' &&
           this.book.genre.trim() !== '' &&
           this.book.price > 0 &&
           this.book.quantite >= 0 &&
           this.book.language.trim() !== '';
  }

  private resetUploadState(): void {
    this.isSubmitting = false;
    this.uploadProgress = 0;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}