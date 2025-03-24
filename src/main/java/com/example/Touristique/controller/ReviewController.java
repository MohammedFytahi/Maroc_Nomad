package com.example.Touristique.controller;

import com.example.Touristique.dto.ReviewDTO;
import com.example.Touristique.mapper.ReviewMapper;
import com.example.Touristique.model.Review;
import com.example.Touristique.model.User;
import com.example.Touristique.repository.ReviewRepository;
import com.example.Touristique.repository.UserRepository;
import com.example.Touristique.service.impl.ReviewServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewServiceImpl reviewService;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;

    @Autowired
    public ReviewController(ReviewServiceImpl reviewService, UserRepository userRepository, ReviewRepository reviewRepository, ReviewMapper reviewMapper) {
        this.reviewService = reviewService;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.reviewMapper = reviewMapper;
    }

    @PostMapping
    public ResponseEntity<String> addReview(
            @RequestBody ReviewDTO reviewDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Utilisateur non authentifié");
        }
        // Récupérer l'ID de l'utilisateur à partir de l'email (username)
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'email : " + userDetails.getUsername()));
        reviewDTO.setUserId(user.getId());
        try {
            reviewService.addReview(reviewDTO);
            return ResponseEntity.ok("Review ajoutée avec succès !");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erreur lors de l'ajout de la review : " + e.getMessage());
        }
    }

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<Map<String, Object>> getReviewsByServiceId(@PathVariable Long serviceId) {
        try {
            // Récupérer les reviews pour le service
            List<Review> reviews = reviewRepository.findByServiceId(serviceId);
            List<ReviewDTO> reviewDTOs = reviews.stream()
                    .map(reviewMapper::toDto)
                    .collect(Collectors.toList());

             long reviewCount = reviewRepository.countByServiceId(serviceId);

             Double averageRating = reviewRepository.findAverageRatingByServiceId(serviceId);
            if (averageRating == null) {
                averageRating = 0.0;
            }

             Map<String, Object> response = new HashMap<>();
            response.put("reviews", reviewDTOs);
            response.put("reviewCount", reviewCount);
            response.put("averageRating", averageRating);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Erreur lors de la récupération des reviews : " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}