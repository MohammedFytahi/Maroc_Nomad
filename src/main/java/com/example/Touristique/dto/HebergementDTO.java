package com.example.Touristique.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class HebergementDTO {
    private Long id;
    private String nom;
    private String description;
    private Double prix;
    private Boolean disponibilite;
    private Long providerId;
    private String type;
    private List<Date> horaires;
    private Double note;
    private Date dateCalculated;
    private String imageUrl;
}