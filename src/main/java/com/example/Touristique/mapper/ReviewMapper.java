package com.example.Touristique.mapper;

import com.example.Touristique.dto.ReviewDTO;
import com.example.Touristique.model.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    ReviewMapper INSTANCE = Mappers.getMapper(ReviewMapper.class);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "note", source = "note")
    @Mapping(target = "commentaire", source = "commentaire")
    Review toEntity(ReviewDTO dto);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "note", source = "note")
    @Mapping(target = "commentaire", source = "commentaire")
    ReviewDTO toDto(Review entity);
}