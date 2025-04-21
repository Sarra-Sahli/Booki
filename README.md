# 📚 Booki - Application de Vente de Livres en Ligne

Bienvenue sur **Booki**, une application de vente en ligne de livres développée en **architecture microservices** avec **Spring Boot** et **Angular**.  
L’objectif est d’offrir une expérience utilisateur complète, fluide et scalable, avec une séparation claire des responsabilités entre services.

---

## 🧩 Architecture Microservices

L'application est composée de plusieurs microservices indépendants, chacun responsable d'une fonctionnalité spécifique :

- **Books Service** 📘 : gestion des livres (ajout, mise à jour, suppression, recherche, détails).
- **Users Service** 👤 : gestion des utilisateurs (inscription, connexion, profil).
- **Cart Service** 🛒 : gestion du panier d’achat.
- **Payment Service** 💳 : traitement des paiements.
- **Reviews Service** ⭐ : avis et notes sur les livres.
- **Wishlist Service** ❤️ : gestion des livres likés par les utilisateurs.
- **Reclamation Service** 🛠️ : gestion des réclamations et retours clients.
- **Eureka Server** 🔎 : service de découverte.
- **API Gateway** 🌐 : point d’entrée centralisé pour tous les services.

---

## 🧠 Fonctionnalités Clés

### 📘 Gestion des Livres
- Ajouter, modifier, supprimer des livres.
- Rechercher un livre par titre, auteur, catégorie, etc.
- Voir les détails d’un livre.

### 👤 Gestion des Utilisateurs
- Inscription, authentification et gestion du profil utilisateur.
- Récupération du mot de passe.

### 🛒 Panier d’Achat
- Ajouter ou retirer des livres du panier.
- Voir le contenu du panier.
- Finaliser la commande.

### 💳 Paiement
- Simulation de paiement sécurisé.
- Suivi de l’état du paiement.

### ⭐ Avis / Reviews
- Ajouter une review sur un livre (1 à 5 étoiles).
- Modifier ou supprimer une review.
- Voir les reviews d’un livre.
- Consulter la moyenne des notes d’un livre.

### ❤️ Wishlist
- Liker/déliker un livre (ajout/retrait de la wishlist).
- Voir les livres likés par un utilisateur.
- Afficher les livres les plus populaires (les plus likés).

### 🛠️ Réclamations
- Soumettre une réclamation après achat.
- Suivre l’état de sa demande.

---

## 🤝 Travail en Équipe

Le projet a été développé en collaboration, chaque membre ayant pris en charge un ou plusieurs microservices.  
Les services sont communiquants grâce à des appels REST et une architecture orientée services avec Eureka.

---

## 🚀 Démarrage du Projet

### Prérequis
- Java 17
- Maven
- Git
- Docker (optionnel mais recommandé)
- Docker Desktop  (si vous êtes sous Windows)

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone https://github.com/Sarra-Sahli/Booki.git
