package com.example.Touristique.controller;

import com.example.Touristique.dto.ActiviteDTO;
import com.example.Touristique.dto.HebergementDTO;
import com.example.Touristique.dto.RestaurationDTO;
import com.example.Touristique.dto.TransportDTO;
import com.example.Touristique.mapper.ActiviteMapper;
import com.example.Touristique.mapper.HebergementMapper;
import com.example.Touristique.mapper.RestaurationMapper;
import com.example.Touristique.mapper.TransportMapper;
import com.example.Touristique.model.*;
import com.example.Touristique.repository.UserRepository;
import com.example.Touristique.service.impl.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceService serviceService;
    private final TransportMapper transportMapper;
    private final RestaurationMapper restaurationMapper;
    private final ActiviteMapper activiteMapper;
    private final HebergementMapper hebergementMapper;
    private final UserRepository userRepository;

    @Autowired
    public ServiceController(ServiceService serviceService,
                             TransportMapper transportMapper,
                             RestaurationMapper restaurationMapper,
                             ActiviteMapper activiteMapper,
                             HebergementMapper hebergementMapper,
                             UserRepository userRepository) {
        this.serviceService = serviceService;
        this.transportMapper = transportMapper;
        this.restaurationMapper = restaurationMapper;
        this.activiteMapper = activiteMapper;
        this.hebergementMapper = hebergementMapper;
        this.userRepository = userRepository;
    }

    @PostMapping(value = "/transport", consumes = {"multipart/form-data"})
    public ResponseEntity<String> ajouterTransport(
            @RequestPart("service") TransportDTO transportDTO,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        System.out.println("UserDetails: " + userDetails.getUsername() + ", Authorities: " + userDetails.getAuthorities());
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        transportDTO.setProviderId(currentUser.getId());
        if (image != null && !image.isEmpty()) {
            String imagePath = saveImage(image);
            transportDTO.setImageUrl(imagePath);
        }
        serviceService.ajouterTransport(transportDTO);
        return ResponseEntity.ok("Transport ajouté avec succès !");
    }

    @PostMapping(value = "/restauration", consumes = {"multipart/form-data"})
    public ResponseEntity<?> ajouterRestauration(
            @RequestPart("service") RestaurationDTO restaurationDTO,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            System.out.println("UserDetails: " + userDetails.getUsername() + ", Authorities: " + userDetails.getAuthorities());
            User currentUser = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
            restaurationDTO.setProviderId(currentUser.getId());
            if (image != null && !image.isEmpty()) {
                String contentType = image.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    return ResponseEntity.badRequest().body("Seules les images sont autorisées");
                }
                if (image.getSize() > 5 * 1024 * 1024) {
                    return ResponseEntity.badRequest().body("La taille du fichier dépasse la limite maximale de 5Mo");
                }
                String imagePath = saveImage(image);
                restaurationDTO.setImageUrl(imagePath);
            }
            serviceService.ajouterRestauration(restaurationDTO);
            return ResponseEntity.ok("Restauration ajoutée avec succès !");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur lors de l'upload de l'image: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur lors de l'ajout de la restauration: " + e.getMessage());
        }
    }

    @PostMapping(value = "/activite", consumes = {"multipart/form-data"})
    public ResponseEntity<String> ajouterActivite(
            @RequestPart("service") ActiviteDTO activiteDTO,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        System.out.println("UserDetails: " + userDetails.getUsername() + ", Authorities: " + userDetails.getAuthorities());
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        activiteDTO.setProviderId(currentUser.getId());
        if (image != null && !image.isEmpty()) {
            String imagePath = saveImage(image);
            activiteDTO.setImageUrl(imagePath);
        }
        serviceService.ajouterActivite(activiteDTO);
        return ResponseEntity.ok("Activité ajoutée avec succès !");
    }

    @PostMapping(value = "/hebergement", consumes = {"multipart/form-data"})
    public ResponseEntity<String> ajouterHebergement(
            @RequestPart("service") HebergementDTO hebergementDTO,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        System.out.println("UserDetails: " + userDetails.getUsername() + ", Authorities: " + userDetails.getAuthorities());
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        hebergementDTO.setProviderId(currentUser.getId());
        if (image != null && !image.isEmpty()) {
            String imagePath = saveImage(image);
            hebergementDTO.setImageUrl(imagePath);
        }
        serviceService.ajouterHebergement(hebergementDTO);
        return ResponseEntity.ok("Hébergement ajouté avec succès !");
    }

    @GetMapping("/all")
    public ResponseEntity<List<Object>> getAllServices() {
        List<TouristicService> services = serviceService.getAllServices();
        List<Object> serviceDtos = services.stream().map(service -> {
            if (service instanceof Transport) {
                return transportMapper.toDto((Transport) service);
            } else if (service instanceof Restauration) {
                return restaurationMapper.toDto((Restauration) service);
            } else if (service instanceof Activite) {
                return activiteMapper.toDto((Activite) service);
            } else if (service instanceof Hebergement) {
                return hebergementMapper.toDto((Hebergement) service);
            }
            return null;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(serviceDtos);
    }

    @Value("${file.upload-dir:/uploads/services}")
    private String uploadDirConfig;

    private String saveImage(MultipartFile image) throws IOException {
        String uploadDir = System.getProperty("user.dir") + uploadDirConfig;
        System.out.println("Sauvegarde dans : " + uploadDir);
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            System.out.println("Dossier n'existe pas, création...");
            if (!dir.mkdirs()) {
                throw new IOException("Impossible de créer le dossier : " + uploadDir);
            }
            System.out.println("Dossier créé : " + uploadDir);
        }
        String originalFilename = image.getOriginalFilename();
        String cleanFilename = originalFilename != null ? originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_") : "image.jpg";
        String fileName = System.currentTimeMillis() + "_" + cleanFilename;
        File dest = new File(uploadDir + File.separator + fileName);
        image.transferTo(dest);
        String imageUrl = "/uploads/services/" + fileName;
        System.out.println("URL générée : " + imageUrl);
        return imageUrl;
    }

    @PutMapping(value = "/transport/{serviceId}", consumes = {"multipart/form-data"})
    public ResponseEntity<String> modifierTransport(
            @PathVariable Long serviceId,
            @RequestPart("service") TransportDTO transportDTO,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        System.out.println("Modification de transport avec ID: " + serviceId + ", User: " + userDetails.getUsername());
        if (image != null && !image.isEmpty()) {
            String contentType = image.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("Seules les images sont autorisées");
            }
            if (image.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body("La taille du fichier dépasse la limite maximale de 5Mo");
            }
            String imagePath = saveImage(image);
            transportDTO.setImageUrl(imagePath);
        }
        serviceService.modifierService(serviceId, transportDTO, userDetails.getUsername());
        return ResponseEntity.ok("Transport modifié avec succès !");
    }

    @PutMapping(value = "/restauration/{serviceId}", consumes = {"multipart/form-data"})
    public ResponseEntity<String> modifierRestauration(
            @PathVariable Long serviceId,
            @RequestPart("service") RestaurationDTO restaurationDTO,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        System.out.println("Modification de restauration avec ID: " + serviceId + ", User: " + userDetails.getUsername());
        if (image != null && !image.isEmpty()) {
            String contentType = image.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("Seules les images sont autorisées");
            }
            if (image.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body("La taille du fichier dépasse la limite maximale de 5Mo");
            }
            String imagePath = saveImage(image);
            restaurationDTO.setImageUrl(imagePath);
        }
        serviceService.modifierService(serviceId, restaurationDTO, userDetails.getUsername());
        return ResponseEntity.ok("Restauration modifiée avec succès !");
    }

    @PutMapping(value = "/activite/{serviceId}", consumes = {"multipart/form-data"})
    public ResponseEntity<String> modifierActivite(
            @PathVariable Long serviceId,
            @RequestPart("service") ActiviteDTO activiteDTO,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        System.out.println("Modification d'activité avec ID: " + serviceId + ", User: " + userDetails.getUsername());
        if (image != null && !image.isEmpty()) {
            String contentType = image.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("Seules les images sont autorisées");
            }
            if (image.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body("La taille du fichier dépasse la limite maximale de 5Mo");
            }
            String imagePath = saveImage(image);
            activiteDTO.setImageUrl(imagePath);
        }
        serviceService.modifierService(serviceId, activiteDTO, userDetails.getUsername());
        return ResponseEntity.ok("Activité modifiée avec succès !");
    }

    @PutMapping(value = "/hebergement/{serviceId}", consumes = {"multipart/form-data"})
    public ResponseEntity<String> modifierHebergement(
            @PathVariable Long serviceId,
            @RequestPart("service") HebergementDTO hebergementDTO,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        System.out.println("Modification d'hébergement avec ID: " + serviceId + ", User: " + userDetails.getUsername());
        if (image != null && !image.isEmpty()) {
            String contentType = image.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("Seules les images sont autorisées");
            }
            if (image.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body("La taille du fichier dépasse la limite maximale de 5Mo");
            }
            String imagePath = saveImage(image);
            hebergementDTO.setImageUrl(imagePath);
        }
        serviceService.modifierService(serviceId, hebergementDTO, userDetails.getUsername());
        return ResponseEntity.ok("Hébergement modifié avec succès !");
    }

    @DeleteMapping("/{serviceId}")
    public ResponseEntity<String> supprimerService(
            @PathVariable Long serviceId,
            @AuthenticationPrincipal UserDetails userDetails) {
        serviceService.supprimerService(serviceId, userDetails.getUsername());
        return ResponseEntity.ok("Service supprimé avec succès !");
    }
}