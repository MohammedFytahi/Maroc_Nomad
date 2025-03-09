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
    import com.example.Touristique.service.impl.ServiceService;
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

        public ServiceController(ServiceService serviceService,
                                 TransportMapper transportMapper,
                                 RestaurationMapper restaurationMapper,
                                 ActiviteMapper activiteMapper,
                                 HebergementMapper hebergementMapper) {
            this.serviceService = serviceService;
            this.transportMapper = transportMapper;
            this.restaurationMapper = restaurationMapper;
            this.activiteMapper = activiteMapper;
            this.hebergementMapper = hebergementMapper;
        }

        @PostMapping(value = "/transport", consumes = {"multipart/form-data"})
        public ResponseEntity<String> ajouterTransport(
                @RequestPart("service") TransportDTO transportDTO,
                @RequestPart(value = "image", required = false) MultipartFile image,
                @AuthenticationPrincipal UserDetails userDetails) throws IOException {
            System.out.println("UserDetails: " + userDetails.getUsername() + ", Authorities: " + userDetails.getAuthorities());
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

                if (image != null && !image.isEmpty()) {
                    // Validate file type
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
            String currentDir = System.getProperty("user.dir");
            String uploadDir = currentDir + uploadDirConfig;

            // Create directory if it doesn't exist
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                boolean created = dir.mkdirs();
                if (!created) {
                    // Fallback to a temporary directory if the main directory creation fails
                    uploadDir = System.getProperty("java.io.tmpdir") + "/touristique/uploads/services/";
                    dir = new File(uploadDir);
                    if (!dir.exists()) {
                        boolean tempCreated = dir.mkdirs();
                        if (!tempCreated) {
                            throw new IOException("Impossible de créer le dossier : " + uploadDir);
                        }
                    }
                }
            }

             String originalFilename = image.getOriginalFilename();
            String cleanFilename = originalFilename != null ? originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_") : "image.jpg";
            String fileName = System.currentTimeMillis() + "_" + cleanFilename;

             File dest = new File(uploadDir + fileName);
            image.transferTo(dest);

            // Return path relative to the server for accessing the file
            return "/uploads/services/" + fileName;
        }
    }