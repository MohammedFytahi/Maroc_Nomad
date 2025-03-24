package com.example.Touristique.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServiceStatsDTO {
    private Long serviceId; // ID du service
    private String serviceNom; // Nom du service
    private int reservationCount; // Nombre de réservations
    private int reviewCount; // Nombre de reviews
    private Double averageRating; // Note moyenne des reviews (optionnel)
}