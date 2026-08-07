package com.ajith.drinkit.service;

import java.util.List;

import com.ajith.drinkit.dto.ProductRequest;
import com.ajith.drinkit.dto.ProductResponse;

public interface ProductService {

    ProductResponse createProduct(ProductRequest request);

    List<ProductResponse> getAllProducts();

    ProductResponse getProductById(Long id);

    ProductResponse updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);
}