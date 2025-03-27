// src/app/models/book.model.ts
export interface Book {
    id?: number;  // Optionnel pour la création
    title: string;
    author: string;
    genre: string;
    price: number;
    available: boolean;
    publicationDate: string; // Changez de Date à string
}