package Reviews.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import Reviews.entities.Wishlist;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    // Trouver la wishlist par userId
    List<Wishlist> findByUserId(Long userId);

    // Trouver une entrée dans la wishlist par userId et bookId
    Optional<Wishlist> findByUserIdAndBookId(Long userId, Long bookId);

    @Query("SELECT w.bookId, COUNT(w.bookId) AS likeCount FROM Wishlist w WHERE w.isLiked = 1 GROUP BY w.bookId ORDER BY likeCount DESC")
    List<Object[]> findTopLikedBooks();

}
