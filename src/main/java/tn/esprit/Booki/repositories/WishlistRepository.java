package tn.esprit.Booki.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.Booki.entities.Wishlist;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    // Trouver la wishlist par userId
    List<Wishlist> findByUserId(Long userId);

    // Trouver une entrée dans la wishlist par userId et bookId
    Optional<Wishlist> findByUserIdAndBookId(Long userId, Long bookId);
}
