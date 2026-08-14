package com.ajith.drinkit.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.ajith.drinkit.dto.ProductPageResponse;
import com.ajith.drinkit.dto.ProductRequest;
import com.ajith.drinkit.dto.ProductResponse;
import com.ajith.drinkit.entity.User;
import com.ajith.drinkit.service.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
public class ProductController {

        private final ProductService productService;

        public ProductController(ProductService productService) {
                this.productService = productService;
        }

        // ========================================
        // CREATE PRODUCT
        // ADMIN ONLY
        // ========================================

        @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<ProductResponse> createProduct(

                        @Valid @RequestPart("product") ProductRequest request,

                        @RequestPart(value = "image", required = false) MultipartFile image) {

                // Upload image if selected
                if (image != null && !image.isEmpty()) {

                        String fileName = productService.uploadProductImage(
                                        image);

                        request.setImageUrl(fileName);
                }

                return new ResponseEntity<>(
                                productService.createProduct(request),
                                HttpStatus.CREATED);
        }

        // ========================================
        // UPLOAD PRODUCT IMAGE
        // ========================================

        @PostMapping("/upload-image")
        public ResponseEntity<Map<String, String>> uploadImage(
                        @RequestParam("image") MultipartFile image) {

                String fileName = productService.uploadProductImage(
                                image);

                return ResponseEntity.ok(
                                Map.of(
                                                "fileName",
                                                fileName,
                                                "message",
                                                "Image uploaded successfully"));
        }

        // ========================================
        // GET PRODUCTS
        // ========================================

        @GetMapping
        public ResponseEntity<?> getProducts(

                        Authentication authentication,

                        @RequestParam(required = false) String keyword,

                        @RequestParam(required = false) Long categoryId,

                        @RequestParam(required = false) Double minPrice,

                        @RequestParam(required = false) Double maxPrice,

                        @RequestParam(required = false) Boolean inStock,

                        @RequestParam(required = false) Boolean active,

                        @RequestParam(defaultValue = "name") String sortBy,

                        @RequestParam(defaultValue = "asc") String direction,

                        @RequestParam(defaultValue = "0") int page,

                        @RequestParam(defaultValue = "10") int size) {

                // ========================================
                // PUBLIC USER
                // ========================================

                if (authentication == null) {

                        active = true;

                        var result = productService.searchProducts(
                                        keyword,
                                        categoryId,
                                        minPrice,
                                        maxPrice,
                                        inStock,
                                        active,
                                        sortBy,
                                        direction,
                                        page,
                                        size);

                        ProductPageResponse response = new ProductPageResponse(
                                        result.getContent(),
                                        result.getNumber(),
                                        result.getSize(),
                                        result.getTotalElements(),
                                        result.getTotalPages());

                        return ResponseEntity.ok(response);
                }

                // ========================================
                // AUTHENTICATED USER
                // ========================================

                User user = (User) authentication.getPrincipal();

                String role = user.getRole().getRoleName();

                // ========================================
                // CUSTOMER
                // ========================================

                if ("CUSTOMER".equalsIgnoreCase(role)) {

                        active = true;

                        var result = productService.searchProducts(
                                        keyword,
                                        categoryId,
                                        minPrice,
                                        maxPrice,
                                        inStock,
                                        active,
                                        sortBy,
                                        direction,
                                        page,
                                        size);

                        ProductPageResponse response = new ProductPageResponse(
                                        result.getContent(),
                                        result.getNumber(),
                                        result.getSize(),
                                        result.getTotalElements(),
                                        result.getTotalPages());

                        return ResponseEntity.ok(response);
                }

                // ========================================
                // ADMIN
                // ========================================

                if ("ADMIN".equalsIgnoreCase(role)) {

                        /*
                         * ADMIN PRODUCT BEHAVIOUR
                         *
                         * No active parameter:
                         * Show active products.
                         *
                         * active=true:
                         * Show active products.
                         *
                         * active=false:
                         * Show inactive products.
                         */

                        if (active == null) {
                                active = true;
                        }

                        var result = productService.searchProducts(
                                        keyword,
                                        categoryId,
                                        minPrice,
                                        maxPrice,
                                        inStock,
                                        active,
                                        sortBy,
                                        direction,
                                        page,
                                        size);

                        ProductPageResponse response = new ProductPageResponse(
                                        result.getContent(),
                                        result.getNumber(),
                                        result.getSize(),
                                        result.getTotalElements(),
                                        result.getTotalPages());

                        return ResponseEntity.ok(response);
                }

                // ========================================
                // UNKNOWN ROLE
                // ========================================

                return ResponseEntity
                                .status(HttpStatus.FORBIDDEN)
                                .build();
        }

        // ========================================
        // GET PRODUCT BY ID
        // ========================================

        @GetMapping("/{id}")
        public ResponseEntity<ProductResponse> getProductById(
                        @PathVariable Long id,
                        Authentication authentication) {

                ProductResponse product = productService.getProductById(id);

                // ========================================
                // PUBLIC USER
                // ========================================

                if (authentication == null) {

                        if (!Boolean.TRUE.equals(
                                        product.getActive())) {

                                return ResponseEntity
                                                .notFound()
                                                .build();
                        }

                        return ResponseEntity.ok(product);
                }

                // ========================================
                // AUTHENTICATED USER
                // ========================================

                User user = (User) authentication.getPrincipal();

                String role = user.getRole().getRoleName();

                // ========================================
                // CUSTOMER
                // ========================================

                if ("CUSTOMER".equalsIgnoreCase(role)
                                && !Boolean.TRUE.equals(
                                                product.getActive())) {

                        return ResponseEntity
                                        .notFound()
                                        .build();
                }

                // ========================================
                // ADMIN
                // ========================================

                return ResponseEntity.ok(product);
        }

        // ========================================
        // UPDATE PRODUCT
        // ========================================

        @PutMapping("/{id}")
        public ResponseEntity<ProductResponse> updateProduct(
                        @PathVariable Long id,
                        @Valid @RequestBody ProductRequest request) {

                return ResponseEntity.ok(
                                productService.updateProduct(
                                                id,
                                                request));
        }

        // ========================================
        // DELETE PRODUCT
        // ========================================

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteProduct(
                        @PathVariable Long id) {

                productService.deleteProduct(id);

                return ResponseEntity
                                .noContent()
                                .build();
        }
}