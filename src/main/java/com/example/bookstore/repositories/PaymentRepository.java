package com.example.bookstore.repositories;

import com.example.bookstore.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Payment findByStripeSessionId(String sessionId);
}
