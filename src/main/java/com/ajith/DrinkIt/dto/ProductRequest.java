package com.ajith.drinkit.dto;

import lombok.Data;

@Data
public class ProductRequest {

    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String brand;
    private String imageUrl;
    private Boolean active;

    private Long categoryId;
}