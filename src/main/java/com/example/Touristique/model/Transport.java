package com.example.Touristique.model;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
public class Transport extends TouristicService {

    private String type;
    private Date date;
    private Integer  duration;
}