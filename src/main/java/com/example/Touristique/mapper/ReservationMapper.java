package com.example.Touristique.mapper;

import com.example.Touristique.dto.ReservationDTO;
import com.example.Touristique.model.Reservation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ReservationMapper {
    ReservationMapper INSTANCE = Mappers.getMapper(ReservationMapper.class);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "dateReservation", source = "dateReservation")
    @Mapping(target = "statut", source = "statut")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "serviceId", source = "service.id")
    @Mapping(target = "serviceNom", source = "service.nom")
    @Mapping(target = "servicePrix", source = "service.prix")
    @Mapping(target = "paymentStatut", source = "payment.statut")
    ReservationDTO toDto(Reservation reservation);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "dateReservation", source = "dateReservation")
    @Mapping(target = "statut", source = "statut")
    Reservation toEntity(ReservationDTO dto);
}