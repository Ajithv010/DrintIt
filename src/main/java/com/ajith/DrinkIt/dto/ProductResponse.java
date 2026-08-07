package com.ajith.drinkit.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductResponse {

    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String brand;
    private String imageUrl;
    private Boolean active;

    private Long categoryId;
    private String categoryName;
}