package com.example.Touristique.mapper;

import com.example.Touristique.dto.TransportDTO;
import com.example.Touristique.model.Transport;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface TransportMapper {
    TransportMapper INSTANCE = Mappers.getMapper(TransportMapper.class);

    @Mapping(target = "id", source = "id")
    TransportDTO toDto(Transport entity);

    @Mapping(target = "id", source = "id")
    Transport toEntity(TransportDTO dto);
}