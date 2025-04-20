package Reviews.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import Reviews.entities.Reviews;
import Reviews.repositories.ReviewsRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewsService {

    private final ReviewsRepository reviewRepository;

    @Autowired
    private ProfanityFilterService profanityFilterService;

    // Ajouter une review
    public Reviews addReview(Reviews review) {
        // Vérifie si le commentaire contient des mots inappropriés
        if (profanityFilterService.containsBadWords(review.getComment())) {
            // Ajoute un log pour comprendre ce qui se passe
            System.out.println("Bad words detected in comment: " + review.getComment());
            throw new IllegalArgumentException("Le commentaire contient des mots inappropriés !");
        }
        return reviewRepository.save(review);
    }


    // Mettre à jour une review
    @Transactional
    public Reviews updateReview(Long reviewId, Reviews reviewDetails) {
        Optional<Reviews> reviewOptional = reviewRepository.findById(reviewId);
        if (reviewOptional.isPresent()) {
            Reviews review = reviewOptional.get();
            review.setRating(reviewDetails.getRating());
            review.setComment(reviewDetails.getComment());
            return reviewRepository.save(review);
        } else {
            return null; // Si la review n'est pas trouvée
        }
    }

    // Supprimer une review
    public void deleteReview(Long reviewId) {
        Optional<Reviews> reviewOptional = reviewRepository.findById(reviewId);
        if (reviewOptional.isPresent()) {
            reviewRepository.deleteById(reviewId);
        } else {
            throw new RuntimeException("Review non trouvée pour suppression !");
        }
    }


    // Obtenir les reviews d'un livre
    public List<Reviews> getReviewsByBook(Long bookId) {
        return reviewRepository.findByBookId(bookId);
    }


    public Double getAverageRatingForBook(Long bookId) {
        Double avg = reviewRepository.findAverageRatingByBookId(bookId);
        return avg != null ? avg : 0.0;
    }

}
