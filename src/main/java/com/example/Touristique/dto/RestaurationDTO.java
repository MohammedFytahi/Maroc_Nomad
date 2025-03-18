package com.example.Touristique.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RestaurationDTO {
    private Long id;
    private String nom;
    private String description;
    private Double prix;
    private Boolean disponibilite;
    private Long providerId;
    private List<String> menu;
    private List<String> optionRegime;
    private String imageUrl;

    public Boolean getDisponibilite() {
        return disponibilite;
    }
}