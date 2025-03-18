package com.example.Touristique.service.interf;

import com.example.Touristique.dto.ActiviteDTO;
import com.example.Touristique.dto.HebergementDTO;
import com.example.Touristique.dto.RestaurationDTO;
import com.example.Touristique.dto.TransportDTO;
import com.example.Touristique.model.TouristicService;

import java.util.List;

public interface ServiceServiceInterface {

    /**
     * Ajoute un service de transport.
     * @param transportDTO DTO contenant les informations du transport
     */
    void ajouterTransport(TransportDTO transportDTO);

    /**
     * Ajoute un service de restauration.
     * @param restaurationDTO DTO contenant les informations de la restauration
     */
    void ajouterRestauration(RestaurationDTO restaurationDTO);

    /**
     * Ajoute un service d'activité.
     * @param activiteDTO DTO contenant les informations de l'activité
     */
    void ajouterActivite(ActiviteDTO activiteDTO);

    /**
     * Ajoute un service d'hébergement.
     * @param hebergementDTO DTO contenant les informations de l'hébergement
     */
    void ajouterHebergement(HebergementDTO hebergementDTO);

    /**
     * Récupère tous les services touristiques disponibles.
     * @return Liste des services touristiques
     */
    List<TouristicService> getAllServices();

    /**
     * Modifie un service existant appartenant au provider.
     * @param serviceId ID du service à modifier
     * @param serviceDTO DTO contenant les nouvelles informations du service
     * @param providerEmail Email du provider pour vérification
     */
    void modifierService(Long serviceId, Object serviceDTO, String providerEmail);

    /**
     * Supprime un service appartenant au provider.
     * @param serviceId ID du service à supprimer
     * @param providerEmail Email du provider pour vérification
     */
    void supprimerService(Long serviceId, String providerEmail);
}
