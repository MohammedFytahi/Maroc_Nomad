package com.example.Touristique.mapper;

import com.example.Touristique.dto.UserDTO;
import com.example.Touristique.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(target = "role", source = "role") // Assurez-vous que la conversion est correcte
    User toEntity(UserDTO userDTO);

    UserDTO toDTO(User user);
}