package com.ajith.drinkit.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.ajith.drinkit.dto.ProductRequest;
import com.ajith.drinkit.dto.ProductResponse;

public interface ProductService {

        // =========================
        // CREATE
        // =========================

        ProductResponse createProduct(
                        ProductRequest request);

        // =========================
        // GET ALL
        // =========================

        List<ProductResponse> getAllProducts();

        // =========================
        // SEARCH / FILTER
        // =========================

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

        // =========================
        // GET BY ID
        // =========================

        ProductResponse getProductById(
                        Long id);

        // =========================
        // UPDATE
        // =========================

        ProductResponse updateProduct(
                        Long id,
                        ProductRequest request);

        // =========================
        // DELETE
        // =========================

        void deleteProduct(
                        Long id);

        // =========================
        // IMAGE UPLOAD
        // =========================

        String uploadProductImage(
                        MultipartFile image);
}