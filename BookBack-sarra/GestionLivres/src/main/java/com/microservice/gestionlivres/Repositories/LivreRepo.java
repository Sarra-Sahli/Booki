package com.microservice.gestionlivres.Repositories;

import com.microservice.gestionlivres.Entites.Books;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.awt.print.Book;
@Repository
public interface LivreRepo extends JpaRepository<Books, Integer> {
}
