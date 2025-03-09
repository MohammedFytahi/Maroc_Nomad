package com.example.Touristique.service.impl;

import com.example.Touristique.dto.ActiviteDTO;
import com.example.Touristique.dto.HebergementDTO;
import com.example.Touristique.dto.RestaurationDTO;
import com.example.Touristique.dto.TransportDTO;
import com.example.Touristique.mapper.ActiviteMapper;
import com.example.Touristique.mapper.HebergementMapper;
import com.example.Touristique.mapper.RestaurationMapper;
import com.example.Touristique.mapper.TransportMapper;
import com.example.Touristique.model.*;
import com.example.Touristique.repository.ServiceRepository;
import com.example.Touristique.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final TransportMapper transportMapper;
    private final RestaurationMapper restaurationMapper;
    private final UserRepository userRepository;
    private final ActiviteMapper activiteMapper;
    private final HebergementMapper hebergementMapper;

    public ServiceService(ServiceRepository serviceRepository,
                          TransportMapper transportMapper,
                          RestaurationMapper restaurationMapper,
                          UserRepository userRepository, ActiviteMapper activiteMapper, HebergementMapper hebergementMapper) {
        this.serviceRepository = serviceRepository;
        this.transportMapper = transportMapper;
        this.restaurationMapper = restaurationMapper;
        this.userRepository = userRepository;
        this.activiteMapper = activiteMapper;
        this.hebergementMapper = hebergementMapper;
    }

    public void ajouterTransport(TransportDTO transportDTO) {
        if (transportDTO.getProviderId() == null) {
            throw new IllegalArgumentException("providerId ne peut pas être null");
        }
        User provider = userRepository.findById(transportDTO.getProviderId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + transportDTO.getProviderId()));
        Transport transport = transportMapper.toEntity(transportDTO);
        transport.setProvider(provider); // Associe un User persisté
        serviceRepository.save(transport);
    }

    public void ajouterRestauration(RestaurationDTO restaurationDTO) {
        if (restaurationDTO.getProviderId() == null) {
            throw new IllegalArgumentException("providerId ne peut pas être null");
        }
        User provider = userRepository.findById(restaurationDTO.getProviderId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + restaurationDTO.getProviderId()));
        Restauration restauration = restaurationMapper.toEntity(restaurationDTO);
        restauration.setProvider(provider); // Associe un User persisté
        serviceRepository.save(restauration);
    }

    public void ajouterActivite(ActiviteDTO activiteDTO) {
        if (activiteDTO.getProviderId() == null) {
            throw new IllegalArgumentException("providerId ne peut pas être null");
        }
        User provider = userRepository.findById(activiteDTO.getProviderId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + activiteDTO.getProviderId()));
        Activite activite = activiteMapper.toEntity(activiteDTO);
        activite.setProvider(provider);
        serviceRepository.save(activite);
    }

    public void ajouterHebergement(HebergementDTO hebergementDTO) {
        if (hebergementDTO.getProviderId() == null) {
            throw new IllegalArgumentException("providerId ne peut pas être null");
        }
        User provider = userRepository.findById(hebergementDTO.getProviderId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + hebergementDTO.getProviderId()));
        Hebergement hebergement = hebergementMapper.toEntity(hebergementDTO);
        hebergement.setProvider(provider);
        serviceRepository.save(hebergement);
    }

    public List<TouristicService> getAllServices() {
        return serviceRepository.findAll();
    }
}