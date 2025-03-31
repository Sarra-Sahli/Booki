export interface Book {
    id?: number;  // Optionnel pour la création
    title: string;
    author: string;
    genre: string;
    price: number;
    available: boolean;
    imageUrl?: string; // Ajoutez ce champ
    publicationDate: string; // Changez de Date à string
}