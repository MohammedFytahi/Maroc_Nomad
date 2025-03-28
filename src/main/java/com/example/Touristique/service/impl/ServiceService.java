package com.example.Touristique.service.impl;

import com.example.Touristique.Exception.ResourceNotFoundException;
import com.example.Touristique.dto.*;
import com.example.Touristique.mapper.ActiviteMapper;
import com.example.Touristique.mapper.HebergementMapper;
import com.example.Touristique.mapper.RestaurationMapper;
import com.example.Touristique.mapper.TransportMapper;
import com.example.Touristique.model.*;
import com.example.Touristique.repository.ReservationRepository;
import com.example.Touristique.repository.ReviewRepository;
import com.example.Touristique.repository.ServiceRepository;
import com.example.Touristique.repository.UserRepository;
import com.example.Touristique.service.interf.ServiceServiceInterface;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ServiceService implements ServiceServiceInterface {

    private final ServiceRepository serviceRepository;
    private final TransportMapper transportMapper;
    private final RestaurationMapper restaurationMapper;
    private final UserRepository userRepository;
    private final ActiviteMapper activiteMapper;
    private final HebergementMapper hebergementMapper;
    private final ReservationRepository reservationRepository;
    private final ReviewRepository reviewRepository;

    @Value("${file.upload-dir:/uploads/services}")
    private String uploadDirConfig;

    public ServiceService(ServiceRepository serviceRepository,
                          TransportMapper transportMapper,
                          RestaurationMapper restaurationMapper,
                          UserRepository userRepository,
                          ActiviteMapper activiteMapper,
                          HebergementMapper hebergementMapper,
                          ReservationRepository reservationRepository,
                          ReviewRepository reviewRepository) {
        this.serviceRepository = serviceRepository;
        this.transportMapper = transportMapper;
        this.restaurationMapper = restaurationMapper;
        this.userRepository = userRepository;
        this.activiteMapper = activiteMapper;
        this.hebergementMapper = hebergementMapper;
        this.reservationRepository = reservationRepository;
        this.reviewRepository = reviewRepository;
    }

    public void ajouterTransport(TransportDTO transportDTO) {
        if (transportDTO.getProviderId() == null) {
            throw new IllegalArgumentException("providerId ne peut pas être null");
        }
        User provider = userRepository.findById(transportDTO.getProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'ID : " + transportDTO.getProviderId()));
        Transport transport = transportMapper.toEntity(transportDTO);
        transport.setProvider(provider);
        serviceRepository.save(transport);
    }

    public void ajouterRestauration(RestaurationDTO restaurationDTO) {
        if (restaurationDTO.getProviderId() == null) {
            throw new IllegalArgumentException("providerId ne peut pas être null");
        }
        User provider = userRepository.findById(restaurationDTO.getProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'ID : " + restaurationDTO.getProviderId()));
        Restauration restauration = restaurationMapper.toEntity(restaurationDTO);
        restauration.setProvider(provider);
        serviceRepository.save(restauration);
    }

    public void ajouterActivite(ActiviteDTO activiteDTO) {
        if (activiteDTO.getProviderId() == null) {
            throw new IllegalArgumentException("providerId ne peut pas être null");
        }
        User provider = userRepository.findById(activiteDTO.getProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'ID : " + activiteDTO.getProviderId()));
        Activite activite = activiteMapper.toEntity(activiteDTO);
        activite.setProvider(provider);
        serviceRepository.save(activite);
    }

    public void ajouterHebergement(HebergementDTO hebergementDTO) {
        if (hebergementDTO.getProviderId() == null) {
            throw new IllegalArgumentException("providerId ne peut pas être null");
        }
        User provider = userRepository.findById(hebergementDTO.getProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'ID : " + hebergementDTO.getProviderId()));
        Hebergement hebergement = hebergementMapper.toEntity(hebergementDTO);
        hebergement.setProvider(provider);
        serviceRepository.save(hebergement);
    }

    public List<TouristicService> getAllServices() {
        return serviceRepository.findAllWithProvider();
    }

    @Override
    public void modifierService(Long serviceId, Object serviceDTO, String providerEmail) {
        TouristicService existingService = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service introuvable avec l'ID : " + serviceId));

         User provider = userRepository.findByEmail(providerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'email : " + providerEmail));
        if (!existingService.getProvider().getId().equals(provider.getId())) {
            throw new IllegalArgumentException("Vous n'êtes pas autorisé à modifier ce service.");
        }

         if (serviceDTO instanceof TransportDTO transportDTO && transportDTO.getId() != null && !transportDTO.getId().equals(serviceId)) {
            throw new IllegalArgumentException("L'ID du service dans le DTO ne correspond pas à l'ID dans l'URL.");
        } else if (serviceDTO instanceof RestaurationDTO restaurationDTO && restaurationDTO.getId() != null && !restaurationDTO.getId().equals(serviceId)) {
            throw new IllegalArgumentException("L'ID du service dans le DTO ne correspond pas à l'ID dans l'URL.");
        } else if (serviceDTO instanceof ActiviteDTO activiteDTO && activiteDTO.getId() != null && !activiteDTO.getId().equals(serviceId)) {
            throw new IllegalArgumentException("L'ID du service dans le DTO ne correspond pas à l'ID dans l'URL.");
        } else if (serviceDTO instanceof HebergementDTO hebergementDTO && hebergementDTO.getId() != null && !hebergementDTO.getId().equals(serviceId)) {
            throw new IllegalArgumentException("L'ID du service dans le DTO ne correspond pas à l'ID dans l'URL.");
        }

         String oldImageUrl = existingService.getImageUrl();

         if (serviceDTO instanceof TransportDTO transportDTO) {
            Transport transport = (Transport) existingService;
            transport.setNom(transportDTO.getNom() != null ? transportDTO.getNom() : transport.getNom());
            transport.setDescription(transportDTO.getDescription() != null ? transportDTO.getDescription() : transport.getDescription());
            transport.setPrix(transportDTO.getPrix() != null ? transportDTO.getPrix() : transport.getPrix());
            transport.setDisponibilite(transportDTO.getDisponibilite());
            transport.setImageUrl(transportDTO.getImageUrl() != null ? transportDTO.getImageUrl() : transport.getImageUrl());
            transport.setId(existingService.getId());
            transport.setProvider(existingService.getProvider());
            serviceRepository.save(transport);
        } else if (serviceDTO instanceof RestaurationDTO restaurationDTO) {
            Restauration restauration = (Restauration) existingService;
            restauration.setNom(restaurationDTO.getNom() != null ? restaurationDTO.getNom() : restauration.getNom());
            restauration.setDescription(restaurationDTO.getDescription() != null ? restaurationDTO.getDescription() : restauration.getDescription());
            restauration.setPrix(restaurationDTO.getPrix() != null ? restaurationDTO.getPrix() : restauration.getPrix());
            restauration.setDisponibilite(restaurationDTO.getDisponibilite() != null ? restaurationDTO.getDisponibilite() : restauration.getDisponibilite());
            restauration.setImageUrl(restaurationDTO.getImageUrl() != null ? restaurationDTO.getImageUrl() : restauration.getImageUrl());
            restauration.setId(existingService.getId());
            restauration.setProvider(existingService.getProvider());
            serviceRepository.save(restauration);
        } else if (serviceDTO instanceof ActiviteDTO activiteDTO) {
            Activite activite = (Activite) existingService;
            activite.setNom(activiteDTO.getNom() != null ? activiteDTO.getNom() : activite.getNom());
            activite.setDescription(activiteDTO.getDescription() != null ? activiteDTO.getDescription() : activite.getDescription());
            activite.setPrix(activiteDTO.getPrix() != null ? activiteDTO.getPrix() : activite.getPrix());
            activite.setDisponibilite(activiteDTO.getDisponibilite());
            activite.setImageUrl(activiteDTO.getImageUrl() != null ? activiteDTO.getImageUrl() : activite.getImageUrl());
            activite.setId(existingService.getId());
            activite.setProvider(existingService.getProvider());
            serviceRepository.save(activite);
        } else if (serviceDTO instanceof HebergementDTO hebergementDTO) {
            Hebergement hebergement = (Hebergement) existingService;
            hebergement.setNom(hebergementDTO.getNom() != null ? hebergementDTO.getNom() : hebergement.getNom());
            hebergement.setDescription(hebergementDTO.getDescription() != null ? hebergementDTO.getDescription() : hebergement.getDescription());
            hebergement.setPrix(hebergementDTO.getPrix() != null ? hebergementDTO.getPrix() : hebergement.getPrix());
            hebergement.setDisponibilite(hebergementDTO.getDisponibilite() != null ? hebergementDTO.getDisponibilite() : hebergement.getDisponibilite());
            hebergement.setImageUrl(hebergementDTO.getImageUrl() != null ? hebergementDTO.getImageUrl() : hebergement.getImageUrl());
            hebergement.setId(existingService.getId());
            hebergement.setProvider(existingService.getProvider());
            serviceRepository.save(hebergement);
        } else {
            throw new IllegalArgumentException("Type de service non supporté : " + serviceDTO.getClass().getSimpleName());
        }

         String newImageUrl = (serviceDTO instanceof TransportDTO) ? ((TransportDTO) serviceDTO).getImageUrl() :
                (serviceDTO instanceof RestaurationDTO) ? ((RestaurationDTO) serviceDTO).getImageUrl() :
                        (serviceDTO instanceof ActiviteDTO) ? ((ActiviteDTO) serviceDTO).getImageUrl() :
                                (serviceDTO instanceof HebergementDTO) ? ((HebergementDTO) serviceDTO).getImageUrl() : null;
        if (newImageUrl != null && oldImageUrl != null && !newImageUrl.equals(oldImageUrl)) {
            String uploadDir = System.getProperty("user.dir") + uploadDirConfig;
            String oldFileName = oldImageUrl.substring(oldImageUrl.lastIndexOf("/") + 1);
            File oldFile = new File(uploadDir + File.separator + oldFileName);
            if (oldFile.exists()) {
                if (oldFile.delete()) {
                    System.out.println("Ancienne image supprimée : " + oldImageUrl);
                } else {
                    System.out.println("Impossible de supprimer l'ancienne image : " + oldImageUrl);
                }
            }
        }
    }

    @Override
    public void supprimerService(Long serviceId, String providerEmail) {
        TouristicService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service introuvable avec l'ID : " + serviceId));

        User provider = userRepository.findByEmail(providerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'email : " + providerEmail));
        if (!service.getProvider().getId().equals(provider.getId())) {
            throw new IllegalArgumentException("Vous n'êtes pas autorisé à supprimer ce service.");
        }

        serviceRepository.deleteById(serviceId);
    }

    public List<TouristicService> getProviderServices(String providerEmail) {
        User provider = userRepository.findByEmail(providerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'email : " + providerEmail));
        return serviceRepository.findByProvider(provider);
    }

    public ProviderStatsDTO getProviderStats(String providerEmail) {
         User provider = userRepository.findByEmail(providerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'email : " + providerEmail));

         List<TouristicService> services = serviceRepository.findByProvider(provider);

         ProviderStatsDTO statsDTO = new ProviderStatsDTO();
        statsDTO.setProviderId(provider.getId());
        statsDTO.setTotalServices(services.size());

        Map<Long, ServiceStatsDTO> serviceStatsMap = new HashMap<>();
        for (TouristicService service : services) {
            ServiceStatsDTO serviceStats = new ServiceStatsDTO();
            serviceStats.setServiceId(service.getId());
            serviceStats.setServiceNom(service.getNom());

            long reservationCount = reservationRepository.countByServiceId(service.getId());
            serviceStats.setReservationCount((int) reservationCount);

            long reviewCount = reviewRepository.countByServiceId(service.getId());
            serviceStats.setReviewCount((int) reviewCount);
            Double averageRating = reviewRepository.findAverageRatingByServiceId(service.getId());
            serviceStats.setAverageRating(averageRating != null ? averageRating : 0.0);

            serviceStatsMap.put(service.getId(), serviceStats);
        }

        statsDTO.setServiceStats(serviceStatsMap);
        return statsDTO;
    }

public TouristicService getServiceWithMostReservations(){
        return serviceRepository.findAllWithProvider()
                .stream()
                .max((service1,service2)->{
                    Long reservationCount1 = reservationRepository.countByServiceId(service1.getId());
                    Long reservationCount2 = reservationRepository.countByServiceId(service2.getId());
                    return Long.compare(reservationCount1,reservationCount2);

                })
                .orElse(null);
}

    
}