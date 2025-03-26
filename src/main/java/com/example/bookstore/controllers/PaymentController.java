package com.example.bookstore.controllers;

import com.example.bookstore.entities.Payment;
import com.example.bookstore.entities.PaymentStatus;
import com.example.bookstore.services.IPaymentService;
import com.example.bookstore.services.PdfGeneratorService;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payment")
public class PaymentController {
    @Autowired
    private IPaymentService iPaymentService;
    @Autowired
    private PdfGeneratorService pdfGeneratorService;

    @PostMapping("/create-session")
    public Map<String, String> createCheckoutSession(@RequestBody Map<String, Object> request) throws StripeException {
        Double amount = (Double) request.get("amount");
        Long cartId = Long.valueOf(request.get("cartId").toString());
        String customerEmail = (String) request.get("customerEmail");
        String sessionUrl = iPaymentService.createCheckoutSession(amount, cartId, customerEmail);
        return Map.of("url", sessionUrl);
    }

    @GetMapping("/success")
    public String paymentSuccess(@RequestParam String sessionId) {
        iPaymentService.updatePaymentStatus(sessionId, PaymentStatus.SUCCEEDED);
        return "Le paiement a été effectué avec succès !";
    }

    @GetMapping("/cancel")
    public String paymentCancel(@RequestParam String sessionId) {
        iPaymentService.updatePaymentStatus(sessionId, PaymentStatus.CANCELED);
        return "Le paiement a été annulé.";
    }

    @GetMapping
    public List<Payment> getAllPayments() {
        return iPaymentService.getAllPayments();
    }

    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable Long id) {
        return iPaymentService.getPaymentById(id);
    }


    @GetMapping("/{paymentId}/invoice")
    public ResponseEntity<byte[]> generateInvoice(@PathVariable Long paymentId) throws IOException {
        Payment payment = iPaymentService.getPaymentById(paymentId);
        byte[] pdfBytes = pdfGeneratorService.generatePaymentInvoice(payment);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("facture-paiement-" + paymentId + ".pdf").build());

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
