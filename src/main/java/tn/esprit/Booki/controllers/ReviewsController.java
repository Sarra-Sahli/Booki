package tn.esprit.Booki.controllers;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.Booki.entities.Reviews;
import tn.esprit.Booki.services.ReviewsService;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewsController {

    private final ReviewsService reviewService;

    // Ajouter une review
    @PostMapping("/addReview")
    public ResponseEntity<Reviews> createReview(@RequestBody Reviews review) {
        return ResponseEntity.ok(reviewService.createReview(review));
    }

    // Méthode pour mettre à jour une review
    @PutMapping("/updateReview/{id}")
    public ResponseEntity<Reviews> updateReview(@PathVariable Long id, @RequestBody Reviews reviewDetails) {
        Reviews updatedReview = reviewService.updateReview(id, reviewDetails);
        if (updatedReview != null) {
            return ResponseEntity.ok(updatedReview);
        } else {
            return ResponseEntity.status(404).body(null); // Si la review n'est pas trouvée
        }
    }

    // Supprimer une review
    @DeleteMapping("/delete/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok("Review supprimée avec succès !");
    }

    // Méthode pour récupérer les reviews d'un livre
    @GetMapping("/getReviews/{bookId}")
    public ResponseEntity<List<Reviews>> getReviewsByBook(@PathVariable Long bookId) {
        List<Reviews> reviews = reviewService.getReviewsByBook(bookId);
        return ResponseEntity.ok(reviews);
    }
}