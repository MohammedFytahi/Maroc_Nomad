package com.example.Touristique.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServiceDTO {
    private String nom;
    private String description;
    private double prix;
    private boolean disponibilite;
    private Long providerId;
}
