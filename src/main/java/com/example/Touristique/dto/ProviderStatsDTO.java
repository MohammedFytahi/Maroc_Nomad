package com.example.Touristique.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class ProviderStatsDTO {
    private Long providerId; // ID du provider
    private int totalServices; // Nombre total de services
    private Map<Long, ServiceStatsDTO> serviceStats; // Statistiques par service (clé : ID du service)
}