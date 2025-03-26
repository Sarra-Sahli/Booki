package com.example.bookstore.controllers;

import com.example.bookstore.entities.Cart;
import com.example.bookstore.services.ICartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/carts")
public class CartController {
    @Autowired
    private ICartService iCartService;


    @PostMapping
    public Cart createCart(@RequestBody Cart cart) {
        return iCartService.createCart(cart);
    }

    @GetMapping
    public List<Cart> getAllOrders() {
        return iCartService.getAllCarts();
    }

    @PutMapping("/{id}/status")
    public Cart updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        return iCartService.updateCartStatus(id, status);
    }
}
