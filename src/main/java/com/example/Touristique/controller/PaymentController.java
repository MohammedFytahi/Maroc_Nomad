package com.example.Touristique.controller;

import com.example.Touristique.service.impl.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-payment-intent/{reservationId}")
    public ResponseEntity<Map<String, Object>> createPaymentIntent(@PathVariable Long reservationId) {
        Map<String, Object> response = paymentService.createPaymentIntent(reservationId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        // Traitement du webhook Stripe (à implémenter)
        return ResponseEntity.ok("Webhook reçu");
    }

    @PostMapping("/confirm/{paymentIntentId}")
    public ResponseEntity<Void> confirmPayment(@PathVariable String paymentIntentId) {
        paymentService.confirmerPaiement(paymentIntentId);
        return ResponseEntity.ok().build();
    }
}