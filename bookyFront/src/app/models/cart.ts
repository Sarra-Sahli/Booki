export interface Cart{
  id: number;
  bookId: number;          // Maps to book_id in backend
  bookTitle: string;       // Maps to book_title
  bookPrice: number;       // Maps to book_price
  quantity: number;
  totalPrice: number;      // Maps to totalPrice (calculated)
  createdAt: string;       // Maps to created_at (ISO string format)
  imageUrl: string; // Ajoutez ce champ
  userId?: number;         
}