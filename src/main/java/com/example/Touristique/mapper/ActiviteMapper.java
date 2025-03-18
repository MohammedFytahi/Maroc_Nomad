package com.example.Touristique.mapper;

import com.example.Touristique.dto.ActiviteDTO;
import com.example.Touristique.model.Activite;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ActiviteMapper {
    ActiviteMapper INSTANCE = Mappers.getMapper(ActiviteMapper.class);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "providerId", source = "provider", qualifiedByName = "mapProviderToId")
    ActiviteDTO toDto(Activite entity);

    @Mapping(target = "id", source = "id")
    Activite toEntity(ActiviteDTO dto);

    @Named("mapProviderToId")
    default Long mapProviderToId(com.example.Touristique.model.User provider) {
        return provider != null ? provider.getId() : null;
    }
}