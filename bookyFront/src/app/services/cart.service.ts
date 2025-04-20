// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable, catchError, throwError } from 'rxjs';
// import { Cart } from '../models/cart';
// import { environment } from '../../environments/environment';


// @Injectable({
//   providedIn: 'root'
// })
// export class CartService {
//   private readonly apiUrl = `${environment.cartUrl}`;

//   constructor(private http: HttpClient) {}

//   /**
//    * Add item to cart or update quantity if already exists
//    * @param bookId ID of the book to add
//    * @param quantity Quantity to add (default: 1)
//    * @returns Observable with updated cart item
//    */
//   addToCart(bookId: number, quantity: number = 1): Observable<Cart> {
//     const params = new HttpParams()
//       .set('bookId', bookId.toString())
//       .set('quantity', quantity.toString());

//     return this.http.post<Cart>(`${this.apiUrl}/add`, null, { params })
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   /**
//    * Get all cart items for current user
//    * @returns Observable with array of cart items
//    */
//   getCartItems(): Observable<Cart[]> {
//     return this.http.get<Cart[]>(`${this.apiUrl}/all`)
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   /**
//    * Update cart item quantity
//    * @param cartId ID of the cart item to update
//    * @param newQuantity New quantity (must be > 0)
//    * @returns Observable with updated cart item
//    */
//   updateCartItem(cartId: number, newQuantity: number): Observable<Cart> {
//     if (newQuantity <= 0) {
//       return throwError(() => new Error('Quantity must be greater than 0'));
//     }

//     const params = new HttpParams()
//       .set('newQuantity', newQuantity.toString());

//     return this.http.put<Cart>(`${this.apiUrl}/update/${cartId}`, null, { params })
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   /**
//    * Remove item from cart
//    * @param cartId ID of the cart item to remove
//    * @returns Observable of void
//    */
//   deleteCartItem(cartId: number): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/delete/${cartId}`)
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   /**
//    * Calculate total price of all items in cart
//    * @returns Observable with total price
//    */
//   calculateCartTotal(): Observable<number> {
//     return this.http.get<number>(`${this.apiUrl}/total`)
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   /**
//    * Search cart items by book title
//    * @param title Title to search for
//    * @returns Observable with search results
//    */
//   searchByTitle(title: string): Observable<any> {
//     const params = new HttpParams().set('title', title);
//     return this.http.get(`${this.apiUrl}/search`, { params })
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   /**
//    * Clear all items from cart
//    * @returns Observable of void
//    */
//   clearCart(): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/clear`)
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   /**
//    * Get cart item count (for badge)
//    * @returns Observable with total item count
//    */
//   getItemCount(): Observable<number> {
//     return this.http.get<number>(`${this.apiUrl}/count`)
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   /**
//    * Get cart items sorted by price
//    * @param order Sorting order ('asc' or 'desc')
//    * @returns Observable with sorted cart items
//    */
//   getCartsSortedByPrice(order: string = 'asc'): Observable<Cart[]> {
//     const params = new HttpParams().set('order', order);
//     return this.http.get<Cart[]>(`${this.apiUrl}/sorted`, { params })
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   /**
//    * Get today's cart items
//    * @returns Observable with today's cart items
//    */
//   getTodayCarts(): Observable<Cart[]> {
//     return this.http.get<Cart[]>(`${this.apiUrl}/today`)
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   /**
//    * Get cart items from last week
//    * @returns Observable with last week's cart items
//    */
//   getCartsFromLastWeek(): Observable<Cart[]> {
//     return this.http.get<Cart[]>(`${this.apiUrl}/last-week`)
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   /**
//    * Generate QR code for a cart
//    * @param id Cart ID
//    * @returns Observable with QR code image data
//    */
//   getCartQRCode(id: number): Observable<Blob> {
//     return this.http.get(`${this.apiUrl}/${id}/qrcode`, { responseType: 'blob' })
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   /**
//    * Get book popularity chart
//    * @returns Observable with chart image data
//    */
//   getBookPopularityChart(): Observable<Blob> {
//     return this.http.get(`${this.apiUrl}/chart`, { responseType: 'blob' })
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   /**
//    * Get paginated cart items
//    * @param page Page number (0-based)
//    * @param size Page size
//    * @returns Observable with paginated cart items
//    */
//   getPaginatedCarts(page: number = 0, size: number = 3): Observable<any> {
//     const params = new HttpParams()
//       .set('page', page.toString())
//       .set('size', size.toString());

//     return this.http.get(`${this.apiUrl}/paginated`, { params })
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   /**
//    * Handle HTTP errors
//    * @param error HttpErrorResponse
//    * @returns Error observable
//    */
//   private handleError(error: any): Observable<never> {
//     let errorMessage = 'An unknown error occurred';
    
//     if (error.error instanceof ErrorEvent) {
//       // Client-side error
//       errorMessage = `Error: ${error.error.message}`;
//     } else if (error.status) {
//       // Server-side error
//       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
//       if (error.error?.message) {
//         errorMessage += `\nDetails: ${error.error.message}`;
//       }
//     }
    
//     console.error(errorMessage);
//     return throwError(() => new Error(errorMessage));
//   }
// }







import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Cart } from '../models/cart';
import { environment } from '../../environments/environment';

interface PaginatedCarts {
  content: Cart[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
 private readonly apiUrl = `${environment.cartUrl}`;

  constructor(private http: HttpClient) {}

  // ========== CART ITEM OPERATIONS ==========

  /**
   * Add item to cart
   * @param bookId ID of the book to add
   * @param quantity Quantity to add (default: 1)
   * @returns Observable with the added cart item
   */
  addToCart(bookId: number, quantity: number = 1): Observable<Cart> {
    const params = new HttpParams()
      .set('bookId', bookId.toString())
      .set('quantity', quantity.toString());

    return this.http.post<Cart>(`${this.apiUrl}/add`, null, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get cart items for current user
   * @returns Observable with array of cart items
   */
  getCartItems(): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.apiUrl}/user`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get cart items by user ID (admin only)
   * @param userId ID of the user
   * @returns Observable with array of cart items
   */
  getCartsByUserId(userId: number): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.apiUrl}/user/${userId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get all cart items (admin only)
   * @returns Observable with array of all cart items
   */
  getAllCartItems(): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.apiUrl}/all`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update cart item quantity
   * @param cartId ID of the cart item to update
   * @param newQuantity New quantity (must be > 0)
   * @returns Observable with updated cart item
   */
  updateCartItem(cartId: number, newQuantity: number): Observable<Cart> {
    if (newQuantity <= 0) {
      return throwError(() => new Error('Quantity must be greater than 0'));
    }

    const params = new HttpParams()
      .set('newQuantity', newQuantity.toString());

    return this.http.put<Cart>(`${this.apiUrl}/update/${cartId}`, null, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Remove item from cart
   * @param cartId ID of the cart item to remove
   * @returns Observable indicating success
   */
  deleteCartItem(cartId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${cartId}`)
      .pipe(catchError(this.handleError));
  }

  // ========== CART UTILITIES ==========

  /**
   * Calculate total price of all items in cart
   * @returns Observable with total price
   */
  calculateCartTotal(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get current cart item count
   * @returns Observable with item count
   */
  getItemCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Clear all items from cart
   * @returns Observable indicating success
   */
  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear`)
      .pipe(catchError(this.handleError));
  }

  // ========== SEARCH & FILTERS ==========

  /**
   * Search cart items by book title
   * @param title Title to search for
   * @returns Observable with matching cart items
   */
  searchByTitle(title: string): Observable<Cart[]> {
    const params = new HttpParams().set('title', title);
    return this.http.get<Cart[]>(`${this.apiUrl}/search`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get cart items sorted by price
   * @param order Sorting order ('asc' or 'desc')
   * @returns Observable with sorted cart items
   */
  getCartsSortedByPrice(order: 'asc' | 'desc' = 'asc'): Observable<Cart[]> {
    const params = new HttpParams().set('order', order);
    return this.http.get<Cart[]>(`${this.apiUrl}/sorted`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get today's cart items
   * @returns Observable with today's cart items
   */
  getTodayCarts(): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.apiUrl}/today`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get cart items from last week
   * @returns Observable with last week's cart items
   */
  getCartsFromLastWeek(): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.apiUrl}/last-week`)
      .pipe(catchError(this.handleError));
  }

  // ========== PAGINATION ==========

  /**
   * Get paginated cart items
   * @param page Page number (0-based)
   * @param size Page size
   * @returns Observable with paginated response
   */
  getPaginatedCarts(page: number = 0, size: number = 10): Observable<PaginatedCarts> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedCarts>(`${this.apiUrl}/paginated`, { params })
      .pipe(catchError(this.handleError));
  }

  // ========== VISUALIZATION ==========

  /**
   * Generate QR code for a cart
   * @param cartId ID of the cart
   * @returns Observable with QR code image blob
   */
  getCartQRCode(cartId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${cartId}/qrcode`, {
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }

  /**
   * Get book popularity chart
   * @returns Observable with chart image blob
   */
  getBookPopularityChart(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/chart`, {
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }

  // ========== ERROR HANDLING ==========

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      
      // Try to extract server error message
      if (error.error?.message) {
        errorMessage += `\nDetails: ${error.error.message}`;
      } else if (typeof error.error === 'string') {
        errorMessage += `\nDetails: ${error.error}`;
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}