package com.esprit.microservice.Booki.cart.controller;

import com.esprit.microservice.Booki.cart.entity.Cart;
import com.esprit.microservice.Booki.cart.repository.CartRepository;
import com.esprit.microservice.Booki.cart.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;


@RestController
@RequestMapping("/carts")
public class CartRestAPI {

    @Autowired
    private CartService cartService;

    @Autowired
    private CartRepository cartRepository;

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



    @GetMapping("/total")
    public  Double calculateCartTotal() {
        return cartService.calculateCartTotal();
    }


    @GetMapping("/search")
    public ResponseEntity<?> searchByTitle(@RequestParam String title) {
        return cartService.searchByTitle(title);
    }


    @GetMapping("/clear")
    public void clearCart() {
       cartService.clearCart();
    }


    @GetMapping("/count")
    public int countCart() {
        return cartService.cartCount();
    }


    @GetMapping("/sorted")
    public ResponseEntity<?> getCartsSortedByPrice(
            @RequestParam(defaultValue = "asc") String order) {
        boolean ascending = order.equalsIgnoreCase("asc");
        return ResponseEntity.ok(cartService.getAllCartsSortedByPrice(ascending));
    }


    @GetMapping("/today")
    public List<Cart> getTodayCarts() {
        return cartService.getTodayCarts();
    }

    @GetMapping("/last-week")
    public List<Cart> getCartsFromLastWeek() {
        return cartService.getCartsFromLastWeek();
    }


    @GetMapping(value = "/{id}/qrcode", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getCartQRCode(@PathVariable Long id) {
        try {
            byte[] qrCode = cartService.generateCartQRCode(id);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(qrCode);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping(value = "/chart", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getBookPopularityChart() {
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(cartService.generateBookPopularityChart());
    }


    @GetMapping("/paginated")
    public ResponseEntity<Page<Cart>> getPaginatedCarts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {
        Page<Cart> carts = cartRepository.findAll(PageRequest.of(page, size));
        return ResponseEntity.ok(carts);
    }





}