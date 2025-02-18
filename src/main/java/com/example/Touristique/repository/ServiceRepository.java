package com.example.Touristique.repository;

import com.example.Touristique.model.TouristicService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<TouristicService, Long> {
}