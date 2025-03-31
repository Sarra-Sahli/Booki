package com.microservice.gestionlivres.Services;

import com.microservice.gestionlivres.Entites.Books;
import com.microservice.gestionlivres.Repositories.LivreRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class Services implements Iservices{
    @Autowired
    LivreRepo livreRepo;
    @Override
    public Books ajouterBook(Books book) {
        return livreRepo.save(book);
    }

    @Override
    public List<Books> showLivres() {
        return livreRepo.findAll();
    }

    @Override
    public String deleteBook(int id) {
        try {
            // Vérifie d'abord si le livre existe
            if (livreRepo.existsById(id)) {
                livreRepo.deleteById(id);
                return "Livre supprimé avec succès (ID: " + id + ")";
            } else {
                return "Échec de la suppression: Aucun livre trouvé avec l'ID " + id;
            }
        } catch (Exception e) {
            // Log l'erreur si nécessaire
            return "Échec de la suppression: Une erreur est survenue lors de la suppression du livre (ID: " + id + ")";
        }
    }

    public Books getBookById(Long id) {
        return livreRepo.findById(id);
    }

    @Override
    public String modifierBook(int id, Books updatedBook) {
        try {
            Optional<Books> optionalBook = livreRepo.findById(id);

            if (optionalBook.isPresent()) {
                Books existingBook = optionalBook.get();

                // Mise à jour conditionnelle de tous les champs
                if (updatedBook.getTitle() != null) {
                    existingBook.setTitle(updatedBook.getTitle());
                }
                if (updatedBook.getAuthor() != null) {
                    existingBook.setAuthor(updatedBook.getAuthor());
                }
                if (updatedBook.getPrice() != null) {
                    existingBook.setPrice(updatedBook.getPrice());
                }
                if (updatedBook.getAvailable() != null) {
                    existingBook.setAvailable(updatedBook.getAvailable());
                }
                if (updatedBook.getGenre() != null) {
                    existingBook.setGenre(updatedBook.getGenre());
                }
                if (updatedBook.getPublicationDate() != null) {
                    existingBook.setPublicationDate(updatedBook.getPublicationDate());
                }

                if (updatedBook.getQuantite() != null) {
                    existingBook.setQuantite(updatedBook.getQuantite());
                }

                livreRepo.save(existingBook);
                return "Livre modifié avec succès (ID: " + id + ")";
            } else {
                return "Échec : Livre introuvable (ID: " + id + ")";
            }
        } catch (Exception e) {
            return "Erreur lors de la modification : " + e.getMessage();
        }
    }

}
