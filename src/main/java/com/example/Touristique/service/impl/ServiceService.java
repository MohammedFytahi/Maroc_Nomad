package com.example.Touristique.service.impl;

import com.example.Touristique.dto.RestaurationDTO;
import com.example.Touristique.dto.TransportDTO;
import com.example.Touristique.mapper.RestaurationMapper;
import com.example.Touristique.mapper.TransportMapper;
import com.example.Touristique.model.Restauration;
import com.example.Touristique.model.Transport;
import com.example.Touristique.model.User;
import com.example.Touristique.repository.ServiceRepository;
import com.example.Touristique.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final TransportMapper transportMapper;
    private final RestaurationMapper restaurationMapper;
    private final UserRepository userRepository;

    public ServiceService(ServiceRepository serviceRepository,
                          TransportMapper transportMapper,
                          RestaurationMapper restaurationMapper,
                          UserRepository userRepository) {
        this.serviceRepository = serviceRepository;
        this.transportMapper = transportMapper;
        this.restaurationMapper = restaurationMapper;
        this.userRepository = userRepository;
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
}