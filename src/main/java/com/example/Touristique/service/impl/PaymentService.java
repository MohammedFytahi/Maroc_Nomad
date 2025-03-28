package com.example.Touristique.service.impl;

import com.example.Touristique.Exception.ResourceNotFoundException;
import com.example.Touristique.model.Payment;
import com.example.Touristique.model.Reservation;
import com.example.Touristique.model.TouristicService;
import com.example.Touristique.repository.PaymentRepository;
import com.example.Touristique.repository.ReservationRepository;
import com.example.Touristique.service.interf.PaymentServiceInterface;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PaymentService implements PaymentServiceInterface {

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    public PaymentService(PaymentRepository paymentRepository, ReservationRepository reservationRepository) {
        this.paymentRepository = paymentRepository;
        this.reservationRepository = reservationRepository;
    }

    @Override
    @Transactional
    public Map<String, Object> createPaymentIntent(Long reservationId) {
        Stripe.apiKey = stripeSecretKey;
        Map<String, Object> response = new HashMap<>();

        try {
            Reservation reservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new ResourceNotFoundException("Réservation introuvable avec l'ID : " + reservationId));

            TouristicService service = reservation.getService();
            long amount = (long) (service.getPrix() * 100);

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amount)
                    .setCurrency("eur")
                    .setDescription("Réservation du service: " + service.getNom())
                    .putMetadata("reservation_id", reservationId.toString())
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build()
                    )
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            Payment payment = new Payment();
            payment.setMontant(service.getPrix());
            payment.setDevise("EUR");
            payment.setStatut("EN_ATTENTE");
            payment.setReservation(reservation);
            paymentRepository.save(payment);

            response.put("clientSecret", paymentIntent.getClientSecret());
            response.put("paymentId", payment.getId());
            response.put("amount", service.getPrix());
            response.put("currency", "EUR");

            return response;
        } catch (StripeException e) {
            throw new RuntimeException("Erreur lors de la création du paiement: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void confirmerPaiement(String paymentIntentId) {
        try {
            Stripe.apiKey = stripeSecretKey;
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);

            String reservationIdStr = paymentIntent.getMetadata().get("reservation_id");
            Long reservationId = Long.parseLong(reservationIdStr);

            Reservation reservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new ResourceNotFoundException("Réservation introuvable avec l'ID : " + reservationId));

            reservation.setStatut("CONFIRMEE");
            reservationRepository.save(reservation);

            Payment payment = paymentRepository.findByReservation(reservation)
                    .orElseThrow(() -> new ResourceNotFoundException("Paiement introuvable pour la réservation avec l'ID : " + reservationId));
            payment.setStatut("COMPLETE");
            paymentRepository.save(payment);
        } catch (StripeException e) {
            throw new RuntimeException("Erreur lors de la confirmation du paiement: " + e.getMessage());
        }
    }


}