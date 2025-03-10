package com.example.Touristique.mapper;

import com.example.Touristique.dto.ActiviteDTO;
import com.example.Touristique.model.Activite;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ActiviteMapper {
    ActiviteMapper INSTANCE = Mappers.getMapper(ActiviteMapper.class);

    @Mapping(target = "id", source = "id")
    Activite toEntity(ActiviteDTO dto);
    @Mapping(target = "id", source = "id")
    ActiviteDTO toDto(Activite entity);
}