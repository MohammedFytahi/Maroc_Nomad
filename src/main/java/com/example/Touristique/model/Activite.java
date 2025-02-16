package com.example.Touristique.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Activite extends Service {

    @ElementCollection
    private List<String> menu;

    @ElementCollection
    private List<String> optionRegime;
}