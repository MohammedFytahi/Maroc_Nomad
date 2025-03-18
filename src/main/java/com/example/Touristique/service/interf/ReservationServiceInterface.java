package com.example.Touristique.service.interf;


import com.example.Touristique.model.Reservation;
import java.util.List;

public interface ReservationServiceInterface {

    /**
     * Réserve un service touristique pour l'utilisateur connecté.
     * @param serviceId ID du service à réserver
     * @return La réservation créée
     */
    Reservation reserverService(Long serviceId);

    /**
     * Change le statut d'une réservation existante.
     * @param reservationId ID de la réservation
     * @param nouveauStatut Nouveau statut à appliquer
     * @return La réservation mise à jour
     */
    Reservation changerStatutReservation(Long reservationId, String nouveauStatut);

    /**
     * Annule une réservation existante.
     * @param reservationId ID de la réservation à annuler
     */
    void annulerReservation(Long reservationId);

    /**
     * Récupère toutes les réservations de l'utilisateur connecté.
     * @return Liste des réservations de l'utilisateur
     */
    List<Reservation> getUserReservations();
}