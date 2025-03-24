package com.example.Touristique.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewDTO {
    private Long id;
    private int note;
    private String commentaire;
    private Long userId;
    private Long serviceId;
    private String userName;
}