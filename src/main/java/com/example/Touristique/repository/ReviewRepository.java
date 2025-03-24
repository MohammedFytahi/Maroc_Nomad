package com.example.Touristique.repository;

import com.example.Touristique.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
 List<Review> findByServiceId(Long serviceId);
 long countByServiceId(Long serviceId);

 @Query("SELECT AVG(r.note) FROM Review r WHERE r.service.id = :serviceId")
 Double findAverageRatingByServiceId(Long serviceId);
 }