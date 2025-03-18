package com.example.Touristique.service.impl;

import com.example.Touristique.model.Reservation;
import com.example.Touristique.model.TouristicService;
import com.example.Touristique.model.User;
import com.example.Touristique.repository.ReservationRepository;
import com.example.Touristique.repository.ServiceRepository;
import com.example.Touristique.repository.UserRepository;
import com.example.Touristique.service.interf.ReservationServiceInterface;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReservationService implements ReservationServiceInterface {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;

    public ReservationService(ReservationRepository reservationRepository, UserRepository userRepository, ServiceRepository serviceRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
    }

    @Transactional
    public Reservation reserverService(Long serviceId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        Optional<TouristicService> serviceOpt = serviceRepository.findById(serviceId);

        if (userOpt.isEmpty() || serviceOpt.isEmpty()) {
            throw new RuntimeException("Utilisateur ou Service introuvable");
        }

        Reservation reservation = new Reservation();
        reservation.setUser(userOpt.get());
        reservation.setService(serviceOpt.get());
        reservation.setDateReservation(new Date());
        reservation.setStatut("EN_ATTENTE_PAIEMENT");

        return reservationRepository.save(reservation);
    }

    public Reservation changerStatutReservation(Long reservationId, String nouveauStatut) {
        Optional<Reservation> reservationOpt = reservationRepository.findById(reservationId);

        if (reservationOpt.isEmpty()) {
            throw new RuntimeException("Réservation introuvable");
        }

        Reservation reservation = reservationOpt.get();
        reservation.setStatut(nouveauStatut);
        return reservationRepository.save(reservation);
    }

    @Transactional
    public void annulerReservation(Long reservationId) {
        Optional<Reservation> reservationOpt = reservationRepository.findById(reservationId);
        if (reservationOpt.isPresent() &&
                ("CONFIRMEE".equals(reservationOpt.get().getStatut()) ||
                        "COMPLETE".equals(reservationOpt.get().getStatut()))) {
         }

        reservationRepository.deleteById(reservationId);
    }

    @Transactional(readOnly = true)
    public List<Reservation> getUserReservations() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return reservationRepository.findByUser(user);
    }
}