# 📚 Booki - Gestion des Reviews et des Wishlists

Bienvenue dans le projet **Booki** !

Ce projet fait partie d'une architecture en microservices développée avec **Spring Boot**, où j'ai pris en charge la partie **gestion des reviews** et **wishlists** (livres likés).  
On a également intégré **Eureka Server** pour la découverte de services et une **API Gateway** pour centraliser les appels.

🤝 Travail en équipe
Ce projet a été développé en équipe dans un contexte d’architecture microservices.
Chaque membre a pris en charge un service spécifique. 
Mon rôle était la conception et le développement des services reviews et wishlists.
---

## 🧠 Ce que fait ce projet

### ✨ Microservice Reviews
- Les utilisateurs peuvent laisser un avis sur un livre.
- Ils peuvent attribuer une note (de 1 à 5 étoiles).
- Modifier ou supprimer leurs reviews.
- On peut aussi récupérer la **moyenne des notes d’un livre** 📊.

### ❤️ Microservice Wishlist
- Lorsqu’un utilisateur "like" un livre, il est automatiquement ajouté à sa wishlist.
- On peut retirer le like aussi (toggle).
- On peut voir tous les livres likés par un utilisateur.
- Et on peut consulter **les livres les plus populaires**, c’est-à-dire les plus likés 📈.

---

## 🚀 Démarrage du projet

### Pré-requis
- Java 17
- Maven
- Git
- Docker (optionnel)
- Docker Desktop + WSL2 si tu es sur Windows

### Étapes à suivre

1. **Cloner le repo**
```bash
git clone https://github.com/ton-utilisateur/booki.git
cd booki


🧪 Tester avec Postman
Voici quelques exemples d’URL que tu peux tester :

📍 Reviews
POST /reviews/addReview → Ajouter un avis

PUT /reviews/updateReview/{id} → Modifier un avis

DELETE /reviews/deleteReview/{id} → Supprimer un avis

GET /reviews/book/{bookId} → Voir tous les avis d’un livre

GET /reviews/book/average/{bookId} → Moyenne des notes du livre

❤️ Wishlist
POST /wishlist/like/{userId}/{bookId} → Like/Unlike d’un livre

GET /wishlist/{userId} → Afficher la wishlist d’un utilisateur

GET /wishlist/top-liked → Voir les livres les plus likés

