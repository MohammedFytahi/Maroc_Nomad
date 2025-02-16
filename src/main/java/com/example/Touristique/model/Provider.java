package com.example.Touristique.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Provider extends User {

    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL)
    private List<Service> servicesOffert;
}