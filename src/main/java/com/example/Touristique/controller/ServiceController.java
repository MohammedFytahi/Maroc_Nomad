package com.example.Touristique.controller;

import com.example.Touristique.dto.RestaurationDTO;
import com.example.Touristique.dto.TransportDTO;
import com.example.Touristique.enums.Role;
import com.example.Touristique.model.User;
 import com.example.Touristique.repository.UserRepository;
import com.example.Touristique.service.impl.ServiceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/services")
public class ServiceController {

    private final ServiceService serviceService;
    private final UserRepository userRepository;

    public ServiceController(ServiceService serviceService, UserRepository userRepository) {
        this.serviceService = serviceService;
        this.userRepository = userRepository;
    }

    @PostMapping("/transport")
    public ResponseEntity<String> ajouterTransport(@RequestBody TransportDTO transportDTO, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (user.getRole() != Role.PROVIDER) { // Vérification du rôle PROVIDER
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Seuls les providers peuvent ajouter des services.");
        }

        serviceService.ajouterTransport(transportDTO);
        return ResponseEntity.ok("Transport ajouté avec succès !");
    }

    @PostMapping("/restauration")
    public ResponseEntity<String> ajouterRestauration(@RequestBody RestaurationDTO restaurationDTO, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (user.getRole() != Role.PROVIDER) { // Vérification du rôle PROVIDER
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Seuls les providers peuvent ajouter des services.");
        }

        serviceService.ajouterRestauration(restaurationDTO);
        return ResponseEntity.ok("Restauration ajoutée avec succès !");
    }
}
