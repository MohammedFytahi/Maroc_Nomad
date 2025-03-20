package com.example.Touristique.service.impl;

import com.example.Touristique.dto.ActiviteDTO;
import com.example.Touristique.dto.HebergementDTO;
import com.example.Touristique.dto.RestaurationDTO;
import com.example.Touristique.dto.TransportDTO;
import com.example.Touristique.enums.Role;
import com.example.Touristique.mapper.ActiviteMapper;
import com.example.Touristique.mapper.HebergementMapper;
import com.example.Touristique.mapper.RestaurationMapper;
import com.example.Touristique.mapper.TransportMapper;
import com.example.Touristique.model.*;
import com.example.Touristique.repository.ServiceRepository;
import com.example.Touristique.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServiceServiceTest {

    @Mock
    private ServiceRepository serviceRepository;

    @Mock
    private TransportMapper transportMapper;

    @Mock
    private RestaurationMapper restaurationMapper;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ActiviteMapper activiteMapper;

    @Mock
    private HebergementMapper hebergementMapper;

    @InjectMocks
    private ServiceService serviceService;

    private User provider;
    private TransportDTO transportDTO;
    private RestaurationDTO restaurationDTO;
    private ActiviteDTO activiteDTO;
    private HebergementDTO hebergementDTO;
    private Transport transport;
    private Restauration restauration;
    private Activite activite;
    private Hebergement hebergement;

    @BeforeEach
    void setUp() {
        // Initialisation des objets pour les tests
        provider = new User();
        provider.setId(1L);
        provider.setEmail("provider@example.com");
        provider.setRole(Role.PROVIDER); // Utilisation de l'énumération Role

        transportDTO = new TransportDTO();
        transportDTO.setId(1L);
        transportDTO.setNom("Transport Test");
        transportDTO.setProviderId(1L);
        transportDTO.setPrix(100.0);
        transportDTO.setDisponibilite(true);
        transportDTO.setImageUrl("/uploads/transport.jpg");

        restaurationDTO = new RestaurationDTO();
        restaurationDTO.setId(2L);
        restaurationDTO.setNom("Restauration Test");
        restaurationDTO.setProviderId(1L);
        restaurationDTO.setPrix(50.0);
        restaurationDTO.setDisponibilite(true);
        restaurationDTO.setImageUrl("/uploads/restauration.jpg");

        activiteDTO = new ActiviteDTO();
        activiteDTO.setId(3L);
        activiteDTO.setNom("Activite Test");
        activiteDTO.setProviderId(1L);
        activiteDTO.setPrix(75.0);
        activiteDTO.setDisponibilite(true);
        activiteDTO.setImageUrl("/uploads/activite.jpg");

        hebergementDTO = new HebergementDTO();
        hebergementDTO.setId(4L);
        hebergementDTO.setNom("Hebergement Test");
        hebergementDTO.setProviderId(1L);
        hebergementDTO.setPrix(200.0);
        hebergementDTO.setDisponibilite(true);
        hebergementDTO.setImageUrl("/uploads/hebergement.jpg");

        transport = new Transport();
        transport.setId(1L);
        transport.setNom("Transport Test");
        transport.setProvider(provider);

        restauration = new Restauration();
        restauration.setId(2L);
        restauration.setNom("Restauration Test");
        restauration.setProvider(provider);

        activite = new Activite();
        activite.setId(3L);
        activite.setNom("Activite Test");
        activite.setProvider(provider);

        hebergement = new Hebergement();
        hebergement.setId(4L);
        hebergement.setNom("Hebergement Test");
        hebergement.setProvider(provider);
    }
    // Tests pour ajouterTransport
    @Test
    void ajouterTransport_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(provider));
        when(transportMapper.toEntity(transportDTO)).thenReturn(transport);
        when(serviceRepository.save(any(Transport.class))).thenReturn(transport);

        serviceService.ajouterTransport(transportDTO);

        verify(userRepository).findById(1L);
        verify(transportMapper).toEntity(transportDTO);
        verify(serviceRepository).save(transport);
        assertEquals(provider, transport.getProvider());
    }

    @Test
    void ajouterTransport_ProviderIdNull_ThrowsException() {
        transportDTO.setProviderId(null);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            serviceService.ajouterTransport(transportDTO);
        });

        assertEquals("providerId ne peut pas être null", exception.getMessage());
        verify(userRepository, never()).findById(anyLong());
        verify(serviceRepository, never()).save(any());
    }

    @Test
    void ajouterTransport_ProviderNotFound_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            serviceService.ajouterTransport(transportDTO);
        });

        assertEquals("Utilisateur non trouvé avec l'ID : 1", exception.getMessage());
        verify(userRepository).findById(1L);
        verify(serviceRepository, never()).save(any());
    }

    // Tests pour ajouterRestauration
    @Test
    void ajouterRestauration_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(provider));
        when(restaurationMapper.toEntity(restaurationDTO)).thenReturn(restauration);
        when(serviceRepository.save(any(Restauration.class))).thenReturn(restauration);

        serviceService.ajouterRestauration(restaurationDTO);

        verify(userRepository).findById(1L);
        verify(restaurationMapper).toEntity(restaurationDTO);
        verify(serviceRepository).save(restauration);
        assertEquals(provider, restauration.getProvider());
    }

    @Test
    void ajouterRestauration_ProviderIdNull_ThrowsException() {
        restaurationDTO.setProviderId(null);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            serviceService.ajouterRestauration(restaurationDTO);
        });

        assertEquals("providerId ne peut pas être null", exception.getMessage());
        verify(userRepository, never()).findById(anyLong());
        verify(serviceRepository, never()).save(any());
    }

    // Tests pour ajouterActivite
    @Test
    void ajouterActivite_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(provider));
        when(activiteMapper.toEntity(activiteDTO)).thenReturn(activite);
        when(serviceRepository.save(any(Activite.class))).thenReturn(activite);

        serviceService.ajouterActivite(activiteDTO);

        verify(userRepository).findById(1L);
        verify(activiteMapper).toEntity(activiteDTO);
        verify(serviceRepository).save(activite);
        assertEquals(provider, activite.getProvider());
    }

    // Tests pour ajouterHebergement
    @Test
    void ajouterHebergement_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(provider));
        when(hebergementMapper.toEntity(hebergementDTO)).thenReturn(hebergement);
        when(serviceRepository.save(any(Hebergement.class))).thenReturn(hebergement);

        serviceService.ajouterHebergement(hebergementDTO);

        verify(userRepository).findById(1L);
        verify(hebergementMapper).toEntity(hebergementDTO);
        verify(serviceRepository).save(hebergement);
        assertEquals(provider, hebergement.getProvider());
    }

    // Tests pour getAllServices
    @Test
    void getAllServices_Success() {
        List<TouristicService> services = Arrays.asList(transport, restauration, activite, hebergement);
        when(serviceRepository.findAllWithProvider()).thenReturn(services);

        List<TouristicService> result = serviceService.getAllServices();

        assertEquals(4, result.size());
        assertEquals(services, result);
        verify(serviceRepository).findAllWithProvider();
    }

    // Tests pour modifierService (Transport)
    @Test
    void modifierService_Transport_Success() {
        transport.setImageUrl("/uploads/old_image.jpg");
        when(serviceRepository.findById(1L)).thenReturn(Optional.of(transport));
        when(userRepository.findByEmail("provider@example.com")).thenReturn(Optional.of(provider));
        when(serviceRepository.save(any(Transport.class))).thenReturn(transport);

        TransportDTO updatedDTO = new TransportDTO();
        updatedDTO.setId(1L);
        updatedDTO.setNom("Updated Transport");
        updatedDTO.setPrix(150.0);
        updatedDTO.setImageUrl("/uploads/new_image.jpg");

        serviceService.modifierService(1L, updatedDTO, "provider@example.com");

        assertEquals("Updated Transport", transport.getNom());
        assertEquals(150.0, transport.getPrix());
        assertEquals("/uploads/new_image.jpg", transport.getImageUrl());
        verify(serviceRepository).save(transport);
    }

    @Test
    void modifierService_ServiceNotFound_ThrowsException() {
        when(serviceRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            serviceService.modifierService(1L, transportDTO, "provider@example.com");
        });

        assertEquals("Service introuvable avec l'ID : 1", exception.getMessage());
        verify(serviceRepository, never()).save(any());
    }

    @Test
    void modifierService_UnauthorizedProvider_ThrowsException() {
        User anotherProvider = new User();
        anotherProvider.setId(2L);
        anotherProvider.setEmail("another@example.com");
        transport.setProvider(provider);

        when(serviceRepository.findById(1L)).thenReturn(Optional.of(transport));
        when(userRepository.findByEmail("another@example.com")).thenReturn(Optional.of(anotherProvider));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            serviceService.modifierService(1L, transportDTO, "another@example.com");
        });

        assertEquals("Vous n'êtes pas autorisé à modifier ce service.", exception.getMessage());
        verify(serviceRepository, never()).save(any());
    }

    @Test
    void modifierService_IdMismatch_ThrowsException() {
        transportDTO.setId(2L); // ID différent de celui dans l'URL (1L)

        when(serviceRepository.findById(1L)).thenReturn(Optional.of(transport));
        when(userRepository.findByEmail("provider@example.com")).thenReturn(Optional.of(provider));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            serviceService.modifierService(1L, transportDTO, "provider@example.com");
        });

        assertEquals("L'ID du service dans le DTO ne correspond pas à l'ID dans l'URL.", exception.getMessage());
        verify(serviceRepository, never()).save(any());
    }

    // Tests pour supprimerService
    @Test
    void supprimerService_Success() {
        when(serviceRepository.findById(1L)).thenReturn(Optional.of(transport));
        when(userRepository.findByEmail("provider@example.com")).thenReturn(Optional.of(provider));

        serviceService.supprimerService(1L, "provider@example.com");

        verify(serviceRepository).deleteById(1L);
    }

    @Test
    void supprimerService_UnauthorizedProvider_ThrowsException() {
        User anotherProvider = new User();
        anotherProvider.setId(2L);
        anotherProvider.setEmail("another@example.com");
        transport.setProvider(provider);

        when(serviceRepository.findById(1L)).thenReturn(Optional.of(transport));
        when(userRepository.findByEmail("another@example.com")).thenReturn(Optional.of(anotherProvider));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            serviceService.supprimerService(1L, "another@example.com");
        });

        assertEquals("Vous n'êtes pas autorisé à supprimer ce service.", exception.getMessage());
        verify(serviceRepository, never()).deleteById(anyLong());
    }
}