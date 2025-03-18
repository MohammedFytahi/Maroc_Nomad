package com.example.Touristique.mapper;

import com.example.Touristique.dto.RestaurationDTO;
import com.example.Touristique.model.Restauration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface RestaurationMapper {
    RestaurationMapper INSTANCE = Mappers.getMapper(RestaurationMapper.class);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "providerId", source = "provider", qualifiedByName = "mapProviderToId")
    RestaurationDTO toDto(Restauration entity);

    @Mapping(target = "id", source = "id")
    Restauration toEntity(RestaurationDTO dto);

    @Named("mapProviderToId")
    default Long mapProviderToId(com.example.Touristique.model.User provider) {
        return provider != null ? provider.getId() : null;
    }
}