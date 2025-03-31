package com.esprit.microservice.Booki.cart;

import com.esprit.microservice.Booki.cart.dto.Books;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "GESTIONLIVRES")
public  interface BookClient {

    @GetMapping("/ShowAllLivre")
     List<Books> getAllBooks();


    @GetMapping("books/{id}")
     Books getBookById(@PathVariable Long id);
    // Add other endpoints you need from your Book service

    @PutMapping("/UpdateLivre/{id}")
    String modifierBook(@PathVariable int id, @RequestBody Books updatedBook);
}