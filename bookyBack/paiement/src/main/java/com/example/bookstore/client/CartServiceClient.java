package com.example.bookstore.client;


import com.example.bookstore.dto.CartCheckoutDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "cart-service", url = "http://cart-service:8082") // URL du microservice Cart
public interface CartServiceClient {

    @GetMapping("/carts/{cartId}") // Endpoint dans Cart qui renvoie un panier
    CartCheckoutDTO getCartById(@PathVariable Long cartId);
}
