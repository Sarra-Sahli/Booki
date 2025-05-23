package Reviews.controllers;


import Reviews.services.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    // Ajouter un livre à la wishlist lors d'un like
    @PostMapping("/like/{userId}/{bookId}")
    public ResponseEntity<String> toggleLike(@PathVariable Long userId, @PathVariable Long bookId) {
        boolean liked = wishlistService.toggleLike(userId, bookId);
        return ResponseEntity.ok(liked ? "Livre ajouté à la wishlist" : "Livre retiré de la wishlist");
    }

    // Obtenir la wishlist d'un utilisateur
    @GetMapping("/{userId}")
    public ResponseEntity<?> getWishlist(@PathVariable Long userId) {
        return ResponseEntity.ok(wishlistService.getWishlist(userId));
    }

    @GetMapping("/top-liked")
    public ResponseEntity<List<Map<String, Object>>> getTopLikedBooks() {
        return ResponseEntity.ok(wishlistService.getTopLikedBooks());
    }


}