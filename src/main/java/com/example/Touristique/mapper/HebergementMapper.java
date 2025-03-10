package com.example.Touristique.mapper;

import com.example.Touristique.dto.HebergementDTO;
import com.example.Touristique.model.Hebergement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface HebergementMapper {
    HebergementMapper INSTANCE = Mappers.getMapper(HebergementMapper.class);

    @Mapping(target = "id", source = "id")
    Hebergement toEntity(HebergementDTO dto);
    @Mapping(target = "id", source = "id")
    HebergementDTO toDto(Hebergement entity);
}