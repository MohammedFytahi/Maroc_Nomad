package com.example.Touristique.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class ReservationDTO {
    private Long id;
    private Date dateReservation;
    private String statut;
    private Long userId;
    private Long serviceId;
    private String serviceNom;
    private Double servicePrix;
    private String paymentStatut;
}