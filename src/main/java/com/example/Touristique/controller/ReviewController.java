package com.example.Touristique.controller;

import com.example.Touristique.dto.ReviewDTO;
import com.example.Touristique.model.User;
import com.example.Touristique.repository.UserRepository;
import com.example.Touristique.service.impl.ReviewServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewServiceImpl reviewService;
    private final UserRepository userRepository;

    @Autowired
    public ReviewController(ReviewServiceImpl reviewService, UserRepository userRepository) {
        this.reviewService = reviewService;
        this.userRepository = userRepository;
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
}