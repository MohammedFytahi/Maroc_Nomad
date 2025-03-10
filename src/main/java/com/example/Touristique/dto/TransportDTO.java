package com.example.Touristique.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Getter
@Setter
public class TransportDTO extends ServiceDTO {
    private Long id;
    private String type;
    private Date date;
    private int duration;
    private String imageUrl;
}
