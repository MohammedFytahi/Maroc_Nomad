package com.example.Touristique.mapper;

import com.example.Touristique.dto.RestaurationDTO;
import com.example.Touristique.model.Restauration;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface RestaurationMapper {
    RestaurationMapper INSTANCE = Mappers.getMapper(RestaurationMapper.class);

    Restauration toEntity(RestaurationDTO dto);
    RestaurationDTO toDto(Restauration entity);

}