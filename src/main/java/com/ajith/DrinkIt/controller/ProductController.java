package com.ajith.drinkit.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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

        // =========================
        // CREATE PRODUCT
        // ADMIN ONLY
        // =========================

        @PostMapping
        public ResponseEntity<ProductResponse> createProduct(
                        @Valid @RequestBody ProductRequest request) {

                return new ResponseEntity<>(
                                productService.createProduct(request),
                                HttpStatus.CREATED);
        }

        // =========================
        // GET PRODUCTS
        // PUBLIC
        // SEARCH / FILTER / SORT / PAGINATION
        // =========================

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

                /*
                 * PUBLIC USER
                 *
                 * No authentication means the visitor is
                 * browsing the store without logging in.
                 *
                 * Public users can only see active products.
                 */

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

                // =========================
                // AUTHENTICATED USER
                // =========================

                User user = (User) authentication.getPrincipal();

                String role = user.getRole().getRoleName();

                // =========================
                // CUSTOMER
                // =========================

                if ("CUSTOMER".equalsIgnoreCase(role)) {

                        /*
                         * Customers can only see active products.
                         *
                         * Even if the customer sends:
                         *
                         * active=false
                         *
                         * we force it to true.
                         */

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

                // =========================
                // ADMIN
                // =========================

                if ("ADMIN".equalsIgnoreCase(role)) {

                        /*
                         * Admin can see both active and inactive products.
                         */

                        if (keyword == null
                                        && categoryId == null
                                        && minPrice == null
                                        && maxPrice == null
                                        && inStock == null
                                        && active == null
                                        && page == 0
                                        && size == 10
                                        && "name".equalsIgnoreCase(sortBy)
                                        && "asc".equalsIgnoreCase(direction)) {

                                return ResponseEntity.ok(
                                                productService.getAllProducts());
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

                // =========================
                // UNKNOWN ROLE
                // =========================

                return ResponseEntity.status(
                                HttpStatus.FORBIDDEN).build();
        }

        // =========================
        // GET PRODUCT BY ID
        // PUBLIC
        // =========================

        @GetMapping("/{id}")
        public ResponseEntity<ProductResponse> getProductById(
                        @PathVariable Long id,
                        Authentication authentication) {

                ProductResponse product = productService.getProductById(id);

                /*
                 * Public users can only see active products.
                 */

                if (authentication == null) {

                        if (!Boolean.TRUE.equals(product.getActive())) {
                                return ResponseEntity.notFound().build();
                        }

                        return ResponseEntity.ok(product);
                }

                // =========================
                // AUTHENTICATED USER
                // =========================

                User user = (User) authentication.getPrincipal();

                String role = user.getRole().getRoleName();

                /*
                 * Customers cannot access inactive products.
                 */

                if ("CUSTOMER".equalsIgnoreCase(role)
                                && !Boolean.TRUE.equals(product.getActive())) {

                        return ResponseEntity.notFound().build();
                }

                return ResponseEntity.ok(product);
        }

        // =========================
        // UPDATE PRODUCT
        // ADMIN ONLY
        // =========================

        @PutMapping("/{id}")
        public ResponseEntity<ProductResponse> updateProduct(
                        @PathVariable Long id,
                        @Valid @RequestBody ProductRequest request) {

                return ResponseEntity.ok(
                                productService.updateProduct(
                                                id,
                                                request));
        }

        // =========================
        // DELETE PRODUCT
        // ADMIN ONLY
        // =========================

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteProduct(
                        @PathVariable Long id) {

                productService.deleteProduct(id);

                return ResponseEntity.noContent().build();
        }
}