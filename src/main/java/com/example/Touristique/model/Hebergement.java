package com.example.Touristique.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
public class Hebergement extends TouristicService {

    private String type;

    @ElementCollection
    private List<Date> horaires;

    private Double note;
    private Date dateCalculated;
}