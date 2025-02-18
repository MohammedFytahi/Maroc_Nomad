package com.example.Touristique.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
@Entity
@Getter
@Setter
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "dtype", discriminatorType = DiscriminatorType.STRING)
@Table(name = "service")
public class TouristicService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String description;
    private double prix;
    private boolean disponibilite;

    @ManyToOne
    @JoinColumn(name = "provider_id", referencedColumnName = "id")
    private User provider;

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL)
    private List<Reservation> reservations;
}
