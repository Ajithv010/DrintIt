package com.ajith.drinkit.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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