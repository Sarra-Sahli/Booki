package com.example.bookstore.services;

import com.example.bookstore.entities.Cart;
import jakarta.persistence.criteria.Order;

import java.util.List;

public interface ICartService {
    Cart createCart(Cart cart);
    List<Cart> getAllCarts();
    Cart updateCartStatus(Long orderId, String status);
}
