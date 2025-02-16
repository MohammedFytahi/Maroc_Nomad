package com.example.Touristique.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double montant;
    private String devise;
    private String statut;

    @OneToOne
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;
}