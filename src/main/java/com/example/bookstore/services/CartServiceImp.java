package com.example.bookstore.services;

import com.example.bookstore.entities.Cart;
import com.example.bookstore.repositories.CartRepository;
import jakarta.persistence.criteria.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartServiceImp implements ICartService {

    @Autowired
    private  CartRepository cartRepository;


    @Override
    public Cart createCart(Cart cart) {
        cart.setStatus("PENDING");
        return cartRepository.save(cart);
    }

    @Override
    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    @Override
    public Cart updateCartStatus(Long cartId, String status) {
        Cart cart = cartRepository.findById(cartId).orElseThrow();
        cart.setStatus(status);
        return cartRepository.save(cart);
    }
}
