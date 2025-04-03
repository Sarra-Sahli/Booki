package com.microservice.gestionlivres;

import com.microservice.gestionlivres.Entites.Books;
import com.microservice.gestionlivres.Services.Services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
@org.springframework.web.bind.annotation.RestController
@CrossOrigin(origins = "*") // Pour simplifier pendant le développement
public class RestController {
    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Vérifiez si le fichier est vide
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Le fichier est vide");
            }

            // Créez le répertoire uploads s'il n'existe pas
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                try {
                    Files.createDirectories(uploadPath);
                } catch (IOException e) {
                    return ResponseEntity.status(500)
                            .body("Impossible de créer le répertoire uploads");
                }
            }

            // Générez un nom de fichier unique
            String filename = System.currentTimeMillis() + "_" +
                    file.getOriginalFilename().replace(" ", "_");
            Path filePath = uploadPath.resolve(filename);

            // Sauvegardez le fichier
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return ResponseEntity.ok(filename);
        } catch (IOException e) {
            e.printStackTrace(); // Pour le débogage
            return ResponseEntity.status(500)
                    .body("Erreur lors de l'upload: " + e.getMessage());
        }
    }
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

    @GetMapping("books/{id}")
    public Books getBookById(@PathVariable Long id) {
        return services.getBookById(id);
    }
}