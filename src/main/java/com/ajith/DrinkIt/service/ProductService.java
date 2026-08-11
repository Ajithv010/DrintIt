package com.ajith.drinkit.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.ajith.drinkit.dto.ProductRequest;
import com.ajith.drinkit.dto.ProductResponse;

public interface ProductService {

    ProductResponse createProduct(ProductRequest request);

    List<ProductResponse> getAllProducts();

    Page<ProductResponse> searchProducts(
            String keyword,
            Long categoryId,
            Double minPrice,
            Double maxPrice,
            Boolean inStock,
            Boolean active,
            String sortBy,
            String direction,
            int page,
            int size);

    ProductResponse getProductById(Long id);

    ProductResponse updateProduct(
            Long id,
            ProductRequest request);

    void deleteProduct(Long id);
}