package com.example.Touristique.service.interf;

import com.example.Touristique.dto.LoginRequest;
import com.example.Touristique.dto.LoginResponse;
import com.example.Touristique.dto.UserDTO;

public interface UserServiceInterface {

    /**
     * Enregistre un nouvel utilisateur.
     * @param userDTO DTO contenant les informations de l'utilisateur
     * @return DTO de l'utilisateur enregistré
     */
    UserDTO registerUser(UserDTO userDTO);

    /**
     * Récupère un utilisateur par son email.
     * @param email Email de l'utilisateur
     * @return DTO de l'utilisateur trouvé
     */
    UserDTO getUserByEmail(String email);

    /**
     * Authentifie un utilisateur et génère un token JWT.
     * @param loginRequest Requête contenant les identifiants de connexion
     * @return Réponse contenant le token JWT et le rôle
     */
    LoginResponse login(LoginRequest loginRequest);
}