package com.example.Touristique.repository;

import com.example.Touristique.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
 }