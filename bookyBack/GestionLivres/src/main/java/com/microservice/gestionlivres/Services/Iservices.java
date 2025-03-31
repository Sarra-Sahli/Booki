package com.microservice.gestionlivres.Services;

import com.microservice.gestionlivres.Entites.Books;
import org.springframework.stereotype.Service;

import java.util.List;

public interface Iservices {
   public Books ajouterBook(Books book);
   public List<Books> showLivres();
   public String deleteBook(int id);
   public Books getBookById(Long id);
   String modifierBook(int id, Books updatedBook); // Nouvelle méthode

}
