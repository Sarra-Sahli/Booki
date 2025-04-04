package com.esprit.microservice.Booki.cart.controller;

import com.esprit.microservice.Booki.cart.entity.Cart;
import com.esprit.microservice.Booki.cart.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map; // Import the Map class

@RestController
@RequestMapping("/carts")
public class CartRestAPI {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestParam Long bookId, @RequestParam Integer quantity) {
        try {
            Cart cartItem = cartService.addToCart(bookId, quantity);
            return ResponseEntity.ok(cartItem);
        } catch (RuntimeException ex) {
            // Return a structured error response
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", ex.getMessage());
            errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(errorResponse);
        }
    }


    @DeleteMapping("/delete/{cartId}")
    public ResponseEntity<?> deleteCartItem(@PathVariable Long cartId) {
        try {
            cartService.removeFromCart(cartId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Cart item deleted successfully with ID: " + cartId);
            response.put("status", HttpStatus.OK.value());
            return ResponseEntity.ok(response); // Return JSON
        } catch (RuntimeException ex) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", ex.getMessage());
            errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(errorResponse);
        }
    }


    @PutMapping("/update/{cartId}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long cartId, @RequestParam Integer newQuantity) {
        try {
            Cart updatedCartItem = cartService.updateCartItemQuantity(cartId, newQuantity);
            return ResponseEntity.ok(updatedCartItem);
        } catch (RuntimeException ex) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", ex.getMessage());
            errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(errorResponse);
        }
    }


    @GetMapping("/all")
    public ResponseEntity<List<Cart>> getAllCartItems() {
        List<Cart> cartItems = cartService.getCartContents();
        return ResponseEntity.ok(cartItems);
    }




}