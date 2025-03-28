package com.example.Touristique.service.impl;

import com.example.Touristique.dto.ReviewDTO;
import com.example.Touristique.mapper.ReviewMapper;
import com.example.Touristique.model.Review;
import com.example.Touristique.model.TouristicService;
import com.example.Touristique.model.User;
import com.example.Touristique.repository.ReviewRepository;
import com.example.Touristique.repository.ServiceRepository;
import com.example.Touristique.repository.UserRepository;
import com.example.Touristique.service.interf.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;



    @Override
    public void addReview(ReviewDTO reviewDTO) {
        if (reviewDTO.getUserId() == null || reviewDTO.getServiceId() == null) {
            throw new IllegalArgumentException("userId et serviceId sont obligatoires");
        }
        if (reviewDTO.getNote() < 0 || reviewDTO.getNote() > 5) {
            throw new IllegalArgumentException("La note doit être entre 0 et 5");
        }

         User user = userRepository.findById(reviewDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + reviewDTO.getUserId()));
        TouristicService service = serviceRepository.findById(reviewDTO.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service non trouvé avec l'ID : " + reviewDTO.getServiceId()));

         Review review = reviewMapper.toEntity(reviewDTO);
        review.setUser(user);
        review.setService(service);

        reviewRepository.save(review);
    }
}