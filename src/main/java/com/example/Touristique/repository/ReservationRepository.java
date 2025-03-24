package com.example.Touristique.repository;

import com.example.Touristique.model.Reservation;
import com.example.Touristique.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);
    List<Reservation> findByUserOrderByDateReservationDesc(User user);
    List<Reservation> findByUser(User user);
    List<Reservation> findByServiceId(Long serviceId);
    long countByServiceId(Long serviceId);
}
