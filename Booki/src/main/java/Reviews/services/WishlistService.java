package Reviews.services;

import Reviews.entities.Wishlist;
import Reviews.repositories.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;

    public boolean toggleLike(Long userId, Long bookId) {
        try {
            Optional<Wishlist> existingLike = wishlistRepository.findByUserIdAndBookId(userId, bookId);

            if (existingLike.isPresent()) {
                Wishlist wishlist = existingLike.get();
                int currentLike = Optional.ofNullable(wishlist.getIsLiked()).orElse(0); // Évite NullPointerException
                wishlist.setIsLiked(currentLike == 1 ? 0 : 1);
                wishlistRepository.save(wishlist);
                return wishlist.getIsLiked() == 1;
            } else {
                if (userId == null || bookId == null) {
                    throw new IllegalArgumentException("UserId ou BookId ne peuvent pas être null");
                }

                Wishlist newWishlist = new Wishlist();
                newWishlist.setUserId(userId);
                newWishlist.setBookId(bookId);
                newWishlist.setIsLiked(1);
                wishlistRepository.save(newWishlist);
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace(); // Affiche l'erreur complète
            throw new RuntimeException("Erreur lors du traitement de la wishlist : " + e.getMessage());
        }
    }


    public List<Wishlist> getWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId);
    }


    // Récupérer la wishlist d'un utilisateur
    public List<Map<String, Object>> getTopLikedBooks() {
        List<Object[]> results = wishlistRepository.findTopLikedBooks();

        List<Map<String, Object>> topBooks = new ArrayList<>();

        for (Object[] result : results) {
            Long bookId = (Long) result[0];
            Long likeCount = (Long) result[1];

            Map<String, Object> bookData = new HashMap<>();
            bookData.put("bookId", bookId);
            bookData.put("likeCount", likeCount);

            topBooks.add(bookData);
        }

        return topBooks;
    }


}