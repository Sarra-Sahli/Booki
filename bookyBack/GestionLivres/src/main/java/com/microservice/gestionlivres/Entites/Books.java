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
    private  String Resume;
    private Double price;
    private Boolean available;
    private Integer quantite;  // Nouvel attribut ajouté
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private Genre genre;
    @Enumerated(EnumType.STRING)
    private Language language;

    @Temporal(TemporalType.DATE)
    private Date publicationDate;

    // Constructeurs
    public Books() {}

    public Books(String title, String author, String Resume,Double price, Boolean available,
                 Integer quantite, Genre genre,Language language, Date publicationDate, String imageUrl) {
        this.title = title;
        this.author = author;
        this.Resume = Resume;
        this.price = price;
        this.available = available;
        this.quantite = quantite;  // Initialisation dans le constructeur
        this.genre = genre;
        this.language = language;
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

    public String getResume() {
        return Resume;
    }

    public void setResume(String resume) {
        Resume = resume;
    }

    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }

    public Integer getQuantite() { return quantite; }  // Getter pour la quantité
    public void setQuantite(Integer quantite) { this.quantite = quantite; }  // Setter pour la quantité

    public Genre getGenre() { return genre; }
    public void setGenre(Genre genre) { this.genre = genre; }


    public Language getLanguage() {
        return language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

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
                ", Resume='" + Resume + '\'' +
                ", price=" + price +
                ", available=" + available +
                ", quantite=" + quantite +
                ", imageUrl='" + imageUrl + '\'' +
                ", genre=" + genre +
                ", language=" + language +
                ", publicationDate=" + publicationDate +
                '}';
    }
}