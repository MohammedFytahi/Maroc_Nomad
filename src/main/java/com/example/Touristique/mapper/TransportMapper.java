package com.example.Touristique.mapper;

import com.example.Touristique.dto.TransportDTO;
import com.example.Touristique.model.Transport;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface TransportMapper {
    TransportMapper INSTANCE = Mappers.getMapper(TransportMapper.class);

    @Mapping(source = "providerId", target = "provider.id")
    Transport toEntity(TransportDTO dto);
}
