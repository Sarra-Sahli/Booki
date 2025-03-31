package com.esprit.microservice.Booki.cart.service;

import com.esprit.microservice.Booki.cart.BookClient;
import com.esprit.microservice.Booki.cart.dto.Books;
import com.esprit.microservice.Booki.cart.entity.Cart;
import com.esprit.microservice.Booki.cart.repository.CartRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private BookClient bookClient;

    @Transactional
    public Cart addToCart(Long bookId, Integer quantity) {
        // Validate input parameters
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be a positive number");
        }

        // Step 1: Get book from Book service
        Books book;
        try {
            book = bookClient.getBookById(bookId);
            if (book == null) {
                throw new RuntimeException("Book not found with ID: " + bookId);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch book details: " + e.getMessage());
        }

        // Step 2: Check if book already exists in cart
        Optional<Cart> existingCartItem = cartRepository.findByBookId(bookId);
        if (existingCartItem.isPresent()) {
            throw new RuntimeException(
                    String.format("Book '%s' is already in your cart", book.getTitle())
            );
        }

        // Step 3: Validate stock availability
        if (book.getQuantite() == null || book.getQuantite() < quantity) {
            throw new RuntimeException(
                    String.format("Insufficient stock for '%s'. Requested: %d, Available: %d",
                            book.getTitle(), quantity, book.getQuantite() != null ? book.getQuantite() : 0)
            );
        }

        // Step 4: Create new cart item
        Cart cartItem = new Cart();
        cartItem.setBookId(bookId);
        cartItem.setBookTitle(book.getTitle());
        cartItem.setBookPrice(book.getPrice());
        cartItem.setImageUrl(book.getImageUrl());

        cartItem.setQuantity(quantity);
        cartItem.setTotalPrice(book.getPrice() * quantity);

        // Step 5: Update book stock
        try {
            Books stockUpdate = new Books();
            stockUpdate.setQuantite(book.getQuantite() - quantity);
            String updateResult = bookClient.modifierBook(bookId.intValue(), stockUpdate);

            if (updateResult.contains("Échec") || updateResult.contains("Erreur")) {
                throw new RuntimeException("Failed to update book stock: " + updateResult);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to update book stock: " + e.getMessage());
        }

        // Step 6: Save cart item
        return cartRepository.save(cartItem);
    }

    @Transactional
    public void removeFromCart(Long cartId) {
        Cart cartItem = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        try {
            // Restore the stock quantity
            Books book = bookClient.getBookById(cartItem.getBookId());
            Books stockUpdate = new Books();
            stockUpdate.setQuantite(book.getQuantite() + cartItem.getQuantity());

            String updateResult = bookClient.modifierBook(cartItem.getBookId().intValue(), stockUpdate);

            if (updateResult.contains("Échec") || updateResult.contains("Erreur")) {
                throw new RuntimeException("Failed to restore book stock: " + updateResult);
            }

            // Delete cart item
            cartRepository.delete(cartItem);
        } catch (Exception e) {
            throw new RuntimeException("Failed to remove cart item: " + e.getMessage());
        }
    }


    @Transactional
    public Cart updateCartItemQuantity(Long cartId, Integer newQuantity) {
        if (newQuantity == null || newQuantity < 0) {
            throw new IllegalArgumentException("Quantity must be a positive number");
        }

        Cart cartItem = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        Books book = bookClient.getBookById(cartItem.getBookId());

        // Calculate the stock difference
        int quantityDifference = newQuantity - cartItem.getQuantity();
        int newStockQuantity = book.getQuantite() - quantityDifference;

        // Validate new stock quantity
        if (newStockQuantity < 0) {
            throw new RuntimeException(
                    String.format("Insufficient stock for '%s'. Available: %d, Requested change: %d",
                            book.getTitle(), book.getQuantite(), quantityDifference)
            );
        }

        try {
            // Update book stock
            Books stockUpdate = new Books();
            stockUpdate.setQuantite(newStockQuantity);
            String updateResult = bookClient.modifierBook(cartItem.getBookId().intValue(), stockUpdate);

            if (updateResult.contains("Échec") || updateResult.contains("Erreur")) {
                throw new RuntimeException("Failed to update book stock: " + updateResult);
            }

            // Update cart item
            if (newQuantity == 0) {
                cartRepository.delete(cartItem);
                return null;
            } else {
                cartItem.setQuantity(newQuantity);
                cartItem.setTotalPrice(book.getPrice() * newQuantity);
                return cartRepository.save(cartItem);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to update cart quantity: " + e.getMessage());
        }
    }



    public List<Cart> getCartContents() {
        return cartRepository.findAll();
    }



    public Double calculateCartTotal() {
        return cartRepository.findAll().stream()
                .mapToDouble(Cart::getTotalPrice)
                .sum();
    }

    @Transactional
    public void clearCart() {
        cartRepository.deleteAll();
    }
}