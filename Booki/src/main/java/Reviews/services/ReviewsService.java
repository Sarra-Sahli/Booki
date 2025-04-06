package Reviews.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import Reviews.entities.Reviews;
import Reviews.repositories.ReviewsRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewsService {

    private final ReviewsRepository reviewRepository;

    // Ajouter une review
    public Reviews createReview(Reviews review) {
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
