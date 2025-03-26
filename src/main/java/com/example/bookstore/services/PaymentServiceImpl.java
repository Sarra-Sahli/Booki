package com.example.bookstore.services;

import com.example.bookstore.entities.Payment;
import com.example.bookstore.entities.PaymentMethods;
import com.example.bookstore.entities.PaymentStatus;
import com.example.bookstore.repositories.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentServiceImpl implements IPaymentService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public String createCheckoutSession(Double amount, Long cartId, String customerEmail) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        // Configuration des articles du panier
        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();
        lineItems.add(
                SessionCreateParams.LineItem.builder()
                        .setPriceData(
                                SessionCreateParams.LineItem.PriceData.builder()
                                        .setCurrency("eur")
                                        .setUnitAmount((long) (amount * 100)) // Montant en centimes
                                        .setProductData(
                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                        .setName("Commande - Order & Payment Service")
                                                        .build()
                                        )
                                        .build()
                        )
                        .setQuantity(1L)
                        .build()
        );

        // Création de la session de paiement Stripe
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:8085/bookstore/payment/success?sessionId={CHECKOUT_SESSION_ID}")
                .setCancelUrl("http://localhost:8085/bookstore/payment/cancel?sessionId={CHECKOUT_SESSION_ID}")
                .addAllLineItem(lineItems)
                .setCustomerEmail(customerEmail) // Ajout de l'email du client dans Stripe
                .build();

        Session session = Session.create(params);

        // Enregistrer les détails de paiement dans la base de données
        Payment payment = new Payment();
        payment.setCartId(cartId);
        payment.setPaymentMethod(PaymentMethods.STRIPE);
        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setStripeSessionId(session.getId());
        payment.setAmount(amount); // Sauvegarde du montant
        payment.setPaymentDate(LocalDateTime.now()); // Date actuelle
        payment.setCustomerEmail(customerEmail); // Email du client
        paymentRepository.save(payment);

        return session.getUrl();
    }
    @Override
    public void updatePaymentStatus(String sessionId, PaymentStatus status) {
        // Récupérer le paiement associé à la session Stripe
        Payment payment = paymentRepository.findByStripeSessionId(sessionId);
        if (payment != null) {
            payment.setPaymentStatus(status);
            paymentRepository.save(payment);
        }
    }


    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }


}