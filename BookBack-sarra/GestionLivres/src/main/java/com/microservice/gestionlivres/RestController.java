package com.microservice.gestionlivres;

import com.microservice.gestionlivres.Entites.Books;
import com.microservice.gestionlivres.Services.Services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@org.springframework.web.bind.annotation.RestController
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})

public class RestController {
    @Autowired
    Services services;

    @PostMapping("/AjoutLivre")
    public Books ajouterBook(@RequestBody Books book) {
        return services.ajouterBook(book);
    }

    @GetMapping("/ShowAllLivre")
    public List<Books> showLivres() {
        return services.showLivres();
    }

    @DeleteMapping("/deleteLivre/{id}")
    public String deleteBook(@PathVariable int id) {
        return services.deleteBook(id);
    }

    @PutMapping("/UpdateLivre/{id}")
    public String modifierBook(@PathVariable int id, @RequestBody Books updatedBook) {
        return services.modifierBook(id, updatedBook);
    }
}