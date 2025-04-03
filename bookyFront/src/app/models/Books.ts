// src/app/models/book.model.ts
export interface Book {
    id?: number;  // Optionnel pour la création
    title: string;
    author: string;
    genre: string;
    price: number;
    available: boolean;
    imageUrl?: string; // Ajoutez ce champ
    publicationDate: string;
    rating?: number;
    soldQuantity?: number;
    onSale?: boolean;
    promotionPercent?: number; // Changez de Date à string
    quantite: number; // Ajout du champ quantite
}