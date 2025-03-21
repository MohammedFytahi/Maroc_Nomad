package com.example.Touristique.controller;

import com.example.Touristique.dto.ReservationDTO;
import com.example.Touristique.model.Reservation;
import com.example.Touristique.service.impl.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping("/reserver/{serviceId}")
    public ResponseEntity<Reservation> reserverService(@PathVariable Long serviceId) {
        if (serviceId == null || serviceId < 1) {
            throw new IllegalArgumentException("ID du service invalide");
        }
        Reservation reservation = reservationService.reserverService(serviceId);
        return ResponseEntity.ok(reservation);
    }

    @PutMapping("/{id}/changer-statut")
    public ResponseEntity<Reservation> changerStatut(@PathVariable Long id, @RequestParam String statut) {
        Reservation reservation = reservationService.changerStatutReservation(id, statut);
        return ResponseEntity.ok(reservation);
    }

    @DeleteMapping("/{id}/annuler")
    public ResponseEntity<Void> annulerReservation(@PathVariable Long id) {
        reservationService.annulerReservation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user")
    public ResponseEntity<List<ReservationDTO>> getUserReservations() {
        try {
            List<ReservationDTO> reservations = reservationService.getUserReservations();
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération des réservations: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}