package com.example.Touristique.repository;

import com.example.Touristique.model.TouristicService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<TouristicService, Long> {
    @Query("SELECT s FROM TouristicService s JOIN FETCH s.provider")
    List<TouristicService> findAllWithProvider();
}