package com.microservice.gestionlivres.Entites;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Books {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String author;
    private Double price;
    private Boolean available;
    private Integer quantite;  // Nouvel attribut ajouté
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private Genre genre;

    @Temporal(TemporalType.DATE)
    private Date publicationDate;

    // Constructeurs
    public Books() {}

    public Books(String title, String author, Double price, Boolean available,
                 Integer quantite, Genre genre, Date publicationDate, String imageUrl) {
        this.title = title;
        this.author = author;
        this.price = price;
        this.available = available;
        this.quantite = quantite;  // Initialisation dans le constructeur
        this.genre = genre;
        this.publicationDate = publicationDate;
        this.imageUrl = imageUrl;
    }

    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }

    public Integer getQuantite() { return quantite; }  // Getter pour la quantité
    public void setQuantite(Integer quantite) { this.quantite = quantite; }  // Setter pour la quantité

    public Genre getGenre() { return genre; }
    public void setGenre(Genre genre) { this.genre = genre; }

    public Date getPublicationDate() { return publicationDate; }
    public void setPublicationDate(Date publicationDate) { this.publicationDate = publicationDate; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    @Override
    public String toString() {
        return "Books{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", author='" + author + '\'' +
                ", price=" + price +
                ", available=" + available +
                ", quantite=" + quantite +  // Ajout dans toString()
                ", genre=" + genre +
                ", publicationDate=" + publicationDate +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
}