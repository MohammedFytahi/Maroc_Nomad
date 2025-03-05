package com.example.Touristique.controller;

import com.example.Touristique.dto.RestaurationDTO;
import com.example.Touristique.dto.TransportDTO;
import com.example.Touristique.service.impl.ServiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @PostMapping("/transport")
    public ResponseEntity<String> ajouterTransport(
            @RequestBody TransportDTO transportDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        System.out.println("UserDetails: " + userDetails.getUsername() + ", Authorities: " + userDetails.getAuthorities()); // Debug
        serviceService.ajouterTransport(transportDTO);
        return ResponseEntity.ok("Transport ajouté avec succès !");
    }

    @PostMapping("/restauration")
    public ResponseEntity<String> ajouterRestauration(
            @RequestBody RestaurationDTO restaurationDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        System.out.println("UserDetails: " + userDetails.getUsername() + ", Authorities: " + userDetails.getAuthorities()); // Debug
        serviceService.ajouterRestauration(restaurationDTO);
        return ResponseEntity.ok("Restauration ajoutée avec succès !");
    }
}