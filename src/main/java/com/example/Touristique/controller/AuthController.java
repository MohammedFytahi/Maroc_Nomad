package com.example.Touristique.controller;

import com.example.Touristique.dto.LoginRequest;
import com.example.Touristique.dto.LoginResponse;
import com.example.Touristique.dto.UserDTO;
import com.example.Touristique.service.impl.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.registerUser(userDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = userService.login(loginRequest);
        System.out.println("API Response: " + response);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            UserDTO userDTO = userService.getUserByEmail(email);
            return ResponseEntity.ok(userDTO);
        }
        return ResponseEntity.status(401).body(null);
    }
}