package com.example.Touristique.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/provider")
public class ProviderController {

    @PostMapping("/add-service")
    public ResponseEntity<String> addService(@RequestBody String serviceData, @AuthenticationPrincipal UserDetails userDetails) {
        System.out.println("UserDetails: " + userDetails.getUsername() + ", Authorities: " + userDetails.getAuthorities()); // Debug
        return ResponseEntity.ok("Service ajouté avec succès: " + serviceData);
    }
}