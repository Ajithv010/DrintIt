package com.ajith.drinkit.dto;

import com.ajith.drinkit.entity.Category;
import com.ajith.drinkit.entity.Product;

public class ProductMapper {

    private ProductMapper() {
    }

    public static Product toEntity(ProductRequest request, Category category) {

        Product product = new Product();

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setBrand(request.getBrand());
        product.setImageUrl(request.getImageUrl());
        product.setActive(request.getActive());
        product.setCategory(category);

        return product;
    }

    public static ProductResponse toResponse(Product product) {

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getBrand(),
                product.getImageUrl(),
                product.getActive(),
                product.getCategory().getId(),
                product.getCategory().getName());
    }
}