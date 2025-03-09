package com.example.Touristique.mapper;

import com.example.Touristique.dto.ActiviteDTO;
import com.example.Touristique.model.Activite;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ActiviteMapper {
    ActiviteMapper INSTANCE = Mappers.getMapper(ActiviteMapper.class);

    Activite toEntity(ActiviteDTO dto);
    ActiviteDTO toDto(Activite entity);
}