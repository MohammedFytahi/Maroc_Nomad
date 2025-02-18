package com.example.Touristique.service.impl;
import com.example.Touristique.dto.RestaurationDTO;
import com.example.Touristique.dto.TransportDTO;
import com.example.Touristique.mapper.RestaurationMapper;
import com.example.Touristique.mapper.TransportMapper;
import com.example.Touristique.model.Restauration;
import com.example.Touristique.model.Transport;
import com.example.Touristique.repository.ServiceRepository;
import org.springframework.stereotype.Service;

@Service
public class ServiceService {

     private final ServiceRepository serviceRepository; // Repository générique pour Service

     private final TransportMapper transportMapper;

     private final RestaurationMapper restaurationMapper;

    public ServiceService(ServiceRepository serviceRepository, TransportMapper transportMapper, RestaurationMapper restaurationMapper) {
        this.serviceRepository = serviceRepository;
        this.transportMapper = transportMapper;
        this.restaurationMapper = restaurationMapper;
    }

    public void ajouterTransport(TransportDTO transportDTO) {
        Transport transport = transportMapper.toEntity(transportDTO);
        serviceRepository.save(transport);
    }

    public void ajouterRestauration(RestaurationDTO restaurationDTO) {
        Restauration restauration = restaurationMapper.toEntity(restaurationDTO);
        serviceRepository.save(restauration);
    }
}
