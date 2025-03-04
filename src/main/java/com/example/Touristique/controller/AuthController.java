package com.example.Touristique.controller;

import com.example.Touristique.dto.LoginRequest;
import com.example.Touristique.dto.LoginResponse;
import com.example.Touristique.dto.UserDTO;
import com.example.Touristique.service.impl.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
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
        System.out.println("API Response: " + response); // Debug log
        return ResponseEntity.ok(response);
    }
}