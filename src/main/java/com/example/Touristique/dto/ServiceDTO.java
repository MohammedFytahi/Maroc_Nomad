package com.example.Touristique.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServiceDTO {
    private Long id;
    private String nom;
    private String description;
    private Double prix;
    private Boolean disponibilite;
    private Long providerId;
    private String imageUrl;
}