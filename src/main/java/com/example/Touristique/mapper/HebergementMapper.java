package com.example.Touristique.mapper;

import com.example.Touristique.dto.HebergementDTO;
import com.example.Touristique.model.Hebergement;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface HebergementMapper {
    HebergementMapper INSTANCE = Mappers.getMapper(HebergementMapper.class);

    Hebergement toEntity(HebergementDTO dto);
    HebergementDTO toDto(Hebergement entity);
}