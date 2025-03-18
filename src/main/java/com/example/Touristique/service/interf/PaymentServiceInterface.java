package com.example.Touristique.service.interf;

import java.util.Map;

public interface PaymentServiceInterface {

    /**
     * Crée un PaymentIntent avec Stripe pour une réservation donnée.
     * @param reservationId ID de la réservation
     * @return Map contenant les détails du PaymentIntent (clientSecret, paymentId, etc.)
     */
    Map<String, Object> createPaymentIntent(Long reservationId);

    /**
     * Confirme un paiement en mettant à jour le statut de la réservation et du paiement.
     * @param paymentIntentId ID du PaymentIntent fourni par Stripe
     */
    void confirmerPaiement(String paymentIntentId);
}