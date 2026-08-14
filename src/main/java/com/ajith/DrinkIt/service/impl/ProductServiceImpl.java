package com.ajith.drinkit.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ajith.drinkit.dto.ProductMapper;
import com.ajith.drinkit.dto.ProductRequest;
import com.ajith.drinkit.dto.ProductResponse;
import com.ajith.drinkit.entity.Category;
import com.ajith.drinkit.entity.Product;
import com.ajith.drinkit.exception.ResourceNotFoundException;
import com.ajith.drinkit.repository.CategoryRepository;
import com.ajith.drinkit.repository.OrderItemRepository;
import com.ajith.drinkit.repository.ProductRepository;
import com.ajith.drinkit.service.ProductService;

@Service
public class ProductServiceImpl implements ProductService {

        private final ProductRepository productRepository;
        private final CategoryRepository categoryRepository;
        private final OrderItemRepository orderItemRepository;

        /*
         * Images are stored inside:
         *
         * DrinkIt/
         * DrinkIt-frontend/
         * public/
         * images/
         *
         * This allows the existing React image paths
         * /images/product.jpg to continue working.
         */
        @Value("${drinkit.upload-dir:DrinkIt-frontend/public/images}")
        private String uploadDirectory;

        public ProductServiceImpl(
                        ProductRepository productRepository,
                        CategoryRepository categoryRepository,
                        OrderItemRepository orderItemRepository) {

                this.productRepository = productRepository;
                this.categoryRepository = categoryRepository;
                this.orderItemRepository = orderItemRepository;
        }

        // ========================================
        // CREATE PRODUCT
        // ========================================

        @Override
        public ProductResponse createProduct(
                        ProductRequest request) {

                validateProductRequest(request);

                if (productRepository.existsByName(
                                request.getName().trim())) {

                        throw new IllegalArgumentException(
                                        "Product with this name already exists");
                }

                Category category = categoryRepository
                                .findById(request.getCategoryId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Category not found"));

                Product product = new Product();

                product.setName(
                                request.getName().trim());

                product.setDescription(
                                request.getDescription());

                product.setPrice(
                                request.getPrice());

                product.setStock(
                                request.getStock());

                product.setBrand(
                                request.getBrand());

                product.setImageUrl(
                                request.getImageUrl());

                product.setActive(
                                request.getActive());

                product.setCategory(category);

                Product saved = productRepository.save(product);

                return ProductMapper.toResponse(saved);
        }

        // ========================================
        // GET ALL PRODUCTS
        // ========================================

        @Override
        public List<ProductResponse> getAllProducts() {

                return productRepository.findAll()
                                .stream()
                                .map(ProductMapper::toResponse)
                                .toList();
        }

        // ========================================
        // SEARCH / FILTER
        // ========================================

        @Override
        public Page<ProductResponse> searchProducts(
                        String keyword,
                        Long categoryId,
                        Double minPrice,
                        Double maxPrice,
                        Boolean inStock,
                        Boolean active,
                        String sortBy,
                        String direction,
                        int page,
                        int size) {

                if (page < 0) {

                        throw new IllegalArgumentException(
                                        "Page must be greater than or equal to 0");
                }

                if (size <= 0 || size > 100) {

                        throw new IllegalArgumentException(
                                        "Size must be between 1 and 100");
                }

                if (minPrice != null && minPrice < 0) {

                        throw new IllegalArgumentException(
                                        "Minimum price cannot be negative");
                }

                if (maxPrice != null && maxPrice < 0) {

                        throw new IllegalArgumentException(
                                        "Maximum price cannot be negative");
                }

                if (minPrice != null &&
                                maxPrice != null &&
                                minPrice > maxPrice) {

                        throw new IllegalArgumentException(
                                        "Minimum price cannot be greater than maximum price");
                }

                String validSortField;

                switch (sortBy == null
                                ? "name"
                                : sortBy.toLowerCase()) {

                        case "price":
                                validSortField = "price";
                                break;

                        case "name":
                                validSortField = "name";
                                break;

                        case "stock":
                                validSortField = "stock";
                                break;

                        case "brand":
                                validSortField = "brand";
                                break;

                        default:

                                throw new IllegalArgumentException(
                                                "Invalid sort field. Use name, price, stock or brand");
                }

                Sort.Direction sortDirection;

                if ("desc".equalsIgnoreCase(direction)) {

                        sortDirection = Sort.Direction.DESC;

                } else if ("asc".equalsIgnoreCase(direction)) {

                        sortDirection = Sort.Direction.ASC;

                } else {

                        throw new IllegalArgumentException(
                                        "Invalid sort direction. Use asc or desc");
                }

                Pageable pageable = PageRequest.of(
                                page,
                                size,
                                Sort.by(
                                                sortDirection,
                                                validSortField));

                Specification<Product> specification = (root, query, criteriaBuilder) -> null;

                // ========================================
                // KEYWORD
                // ========================================

                if (keyword != null &&
                                !keyword.trim().isEmpty()) {

                        String searchKeyword = "%" +
                                        keyword.trim().toLowerCase() +
                                        "%";

                        specification = specification.and(
                                        (root,
                                                        query,
                                                        criteriaBuilder) -> criteriaBuilder.or(

                                                                        criteriaBuilder.like(
                                                                                        criteriaBuilder.lower(
                                                                                                        root.get("name")),
                                                                                        searchKeyword),

                                                                        criteriaBuilder.like(
                                                                                        criteriaBuilder.lower(
                                                                                                        root.get("description")),
                                                                                        searchKeyword),

                                                                        criteriaBuilder.like(
                                                                                        criteriaBuilder.lower(
                                                                                                        root.get("brand")),
                                                                                        searchKeyword)));
                }

                // ========================================
                // CATEGORY
                // ========================================

                if (categoryId != null) {

                        specification = specification.and(
                                        (root,
                                                        query,
                                                        criteriaBuilder) -> criteriaBuilder.equal(
                                                                        root.get("category")
                                                                                        .get("id"),
                                                                        categoryId));
                }

                // ========================================
                // MIN PRICE
                // ========================================

                if (minPrice != null) {

                        specification = specification.and(
                                        (root,
                                                        query,
                                                        criteriaBuilder) -> criteriaBuilder
                                                                        .greaterThanOrEqualTo(
                                                                                        root.get("price"),
                                                                                        minPrice));
                }

                // ========================================
                // MAX PRICE
                // ========================================

                if (maxPrice != null) {

                        specification = specification.and(
                                        (root,
                                                        query,
                                                        criteriaBuilder) -> criteriaBuilder
                                                                        .lessThanOrEqualTo(
                                                                                        root.get("price"),
                                                                                        maxPrice));
                }

                // ========================================
                // STOCK
                // ========================================

                if (inStock != null) {

                        if (inStock) {

                                specification = specification.and(
                                                (root,
                                                                query,
                                                                criteriaBuilder) -> criteriaBuilder.greaterThan(
                                                                                root.get("stock"),
                                                                                0));

                        } else {

                                specification = specification.and(
                                                (root,
                                                                query,
                                                                criteriaBuilder) -> criteriaBuilder.equal(
                                                                                root.get("stock"),
                                                                                0));
                        }
                }

                // ========================================
                // ACTIVE
                // ========================================

                if (active != null) {

                        specification = specification.and(
                                        (root,
                                                        query,
                                                        criteriaBuilder) -> criteriaBuilder.equal(
                                                                        root.get("active"),
                                                                        active));
                }

                return productRepository
                                .findAll(
                                                specification,
                                                pageable)
                                .map(ProductMapper::toResponse);
        }

        // ========================================
        // GET PRODUCT BY ID
        // ========================================

        @Override
        public ProductResponse getProductById(
                        Long id) {

                Product product = productRepository
                                .findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found"));

                return ProductMapper.toResponse(product);
        }

        // ========================================
        // UPDATE PRODUCT
        // ========================================

        @Override
        public ProductResponse updateProduct(
                        Long id,
                        ProductRequest request) {

                validateProductRequest(request);

                Product product = productRepository
                                .findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found"));

                Category category = categoryRepository
                                .findById(
                                                request.getCategoryId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Category not found"));

                if (!product.getName()
                                .equalsIgnoreCase(
                                                request.getName().trim())
                                &&
                                productRepository.existsByName(
                                                request.getName().trim())) {

                        throw new IllegalArgumentException(
                                        "Product with this name already exists");
                }

                product.setName(
                                request.getName().trim());

                product.setDescription(
                                request.getDescription());

                product.setPrice(
                                request.getPrice());

                product.setStock(
                                request.getStock());

                product.setBrand(
                                request.getBrand());

                product.setImageUrl(
                                request.getImageUrl());

                product.setActive(
                                request.getActive());

                product.setCategory(category);

                Product updatedProduct = productRepository.save(product);

                return ProductMapper.toResponse(
                                updatedProduct);
        }

        // ========================================
        // DELETE PRODUCT
        // ========================================

        @Override
        public void deleteProduct(Long id) {

                Product product = productRepository
                                .findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found"));

                // ========================================
                // ACTIVE PRODUCT
                // ========================================

                /*
                 * First delete:
                 *
                 * Do NOT physically delete the product.
                 *
                 * Instead mark it inactive.
                 *
                 * This keeps the product available for
                 * existing order history.
                 */

                if (Boolean.TRUE.equals(
                                product.getActive())) {

                        product.setActive(false);

                        productRepository.save(product);

                        return;
                }

                // ========================================
                // INACTIVE PRODUCT
                // ========================================

                /*
                 * Product is already inactive.
                 *
                 * Before permanently deleting it,
                 * check whether it is referenced by
                 * an existing order item.
                 */

                boolean usedInOrder = orderItemRepository
                                .existsByProduct_Id(id);

                // ========================================
                // PRODUCT USED IN ORDER
                // ========================================

                if (usedInOrder) {

                        throw new IllegalStateException(
                                        "This product cannot be permanently deleted because it is used in an existing order.");
                }

                // ========================================
                // PRODUCT NEVER USED IN ORDER
                // ========================================

                /*
                 * Safe to permanently delete.
                 */

                productRepository.delete(product);
        }

        // ========================================
        // UPLOAD PRODUCT IMAGE
        // ========================================

        @Override
        public String uploadProductImage(
                        MultipartFile image) {

                if (image == null ||
                                image.isEmpty()) {

                        throw new IllegalArgumentException(
                                        "Please select an image");
                }

                // ========================================
                // FILE SIZE
                // ========================================

                if (image.getSize() > 5 * 1024 * 1024) {

                        throw new IllegalArgumentException(
                                        "Image size must be less than 5 MB");
                }

                // ========================================
                // FILE TYPE
                // ========================================

                String contentType = image.getContentType();

                if (contentType == null ||
                                !(contentType.equalsIgnoreCase(
                                                "image/jpeg")
                                                ||
                                                contentType.equalsIgnoreCase(
                                                                "image/png")
                                                ||
                                                contentType.equalsIgnoreCase(
                                                                "image/webp"))) {

                        throw new IllegalArgumentException(
                                        "Only JPG, PNG and WEBP images are allowed");
                }

                // ========================================
                // EXTENSION
                // ========================================

                String originalName = image.getOriginalFilename();

                String extension = ".jpg";

                if (originalName != null &&
                                originalName.contains(".")) {

                        extension = originalName.substring(
                                        originalName.lastIndexOf("."))
                                        .toLowerCase();
                }

                // ========================================
                // UNIQUE FILE NAME
                // ========================================

                String fileName = UUID.randomUUID()
                                .toString()
                                + extension;

                // ========================================
                // CREATE DIRECTORY
                // ========================================

                Path directory = Paths.get(
                                System.getProperty(
                                                "user.dir"))
                                .resolve(uploadDirectory)
                                .normalize();

                try {

                        Files.createDirectories(
                                        directory);

                        Path target = directory.resolve(
                                        fileName);

                        Files.copy(
                                        image.getInputStream(),
                                        target,
                                        StandardCopyOption.REPLACE_EXISTING);

                        return fileName;

                } catch (IOException e) {

                        throw new RuntimeException(
                                        "Unable to save product image",
                                        e);
                }
        }

        // ========================================
        // VALIDATE PRODUCT
        // ========================================

        private void validateProductRequest(
                        ProductRequest request) {

                if (request == null) {

                        throw new IllegalArgumentException(
                                        "Product details are required");
                }

                if (request.getName() == null ||
                                request.getName()
                                                .trim()
                                                .isEmpty()) {

                        throw new IllegalArgumentException(
                                        "Product name is required");
                }

                if (request.getPrice() == null ||
                                request.getPrice() <= 0) {

                        throw new IllegalArgumentException(
                                        "Product price must be greater than zero");
                }

                if (request.getStock() == null ||
                                request.getStock() < 0) {

                        throw new IllegalArgumentException(
                                        "Product stock cannot be negative");
                }

                if (request.getCategoryId() == null) {

                        throw new IllegalArgumentException(
                                        "Category ID is required");
                }

                if (request.getActive() == null) {

                        throw new IllegalArgumentException(
                                        "Active status is required");
                }
        }
}