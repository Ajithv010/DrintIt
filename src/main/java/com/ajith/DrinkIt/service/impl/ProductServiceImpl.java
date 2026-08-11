package com.ajith.drinkit.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.ajith.drinkit.dto.ProductMapper;
import com.ajith.drinkit.dto.ProductRequest;
import com.ajith.drinkit.dto.ProductResponse;
import com.ajith.drinkit.entity.Category;
import com.ajith.drinkit.entity.Product;
import com.ajith.drinkit.exception.ResourceNotFoundException;
import com.ajith.drinkit.repository.CategoryRepository;
import com.ajith.drinkit.repository.ProductRepository;
import com.ajith.drinkit.service.ProductService;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(
            ProductRepository productRepository,
            CategoryRepository categoryRepository) {

        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    // =========================
    // CREATE PRODUCT
    // =========================

    @Override
    public ProductResponse createProduct(ProductRequest request) {

        if (productRepository.existsByName(request.getName())) {

            throw new RuntimeException(
                    "Product with this name already exists");
        }

        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found"));

        Product product = new Product();

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setBrand(request.getBrand());
        product.setImageUrl(request.getImageUrl());
        product.setActive(request.getActive());
        product.setCategory(category);

        Product saved = productRepository.save(product);

        return ProductMapper.toResponse(saved);
    }

    // =========================
    // GET ALL PRODUCTS
    // =========================

    @Override
    public List<ProductResponse> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(ProductMapper::toResponse)
                .toList();
    }

    // =========================
    // SEARCH / FILTER / SORT
    // =========================

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

        // =========================
        // VALIDATE PAGINATION
        // =========================

        if (page < 0) {

            throw new IllegalArgumentException(
                    "Page must be greater than or equal to 0");
        }

        if (size <= 0 || size > 100) {

            throw new IllegalArgumentException(
                    "Size must be between 1 and 100");
        }

        // =========================
        // VALIDATE PRICE
        // =========================

        if (minPrice != null &&
                maxPrice != null &&
                minPrice > maxPrice) {

            throw new IllegalArgumentException(
                    "Minimum price cannot be greater than maximum price");
        }

        // =========================
        // SORT
        // =========================

        String validSortField;

        switch (sortBy == null ? "name" : sortBy.toLowerCase()) {

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
                Sort.by(sortDirection, validSortField));

        // =========================
        // BUILD FILTER
        // =========================

        Specification<Product> specification = (root, query, criteriaBuilder) -> null;

        // =========================
        // KEYWORD SEARCH
        // =========================

        if (keyword != null &&
                !keyword.trim().isEmpty()) {

            String searchKeyword = "%" + keyword.trim().toLowerCase() + "%";

            specification = specification.and(
                    (root, query, criteriaBuilder) -> criteriaBuilder.or(

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

        // =========================
        // CATEGORY FILTER
        // =========================

        if (categoryId != null) {

            specification = specification.and(
                    (root, query, criteriaBuilder) -> criteriaBuilder.equal(
                            root.get("category").get("id"),
                            categoryId));
        }

        // =========================
        // MINIMUM PRICE
        // =========================

        if (minPrice != null) {

            specification = specification.and(
                    (root, query, criteriaBuilder) -> criteriaBuilder.greaterThanOrEqualTo(
                            root.get("price"),
                            minPrice));
        }

        // =========================
        // MAXIMUM PRICE
        // =========================

        if (maxPrice != null) {

            specification = specification.and(
                    (root, query, criteriaBuilder) -> criteriaBuilder.lessThanOrEqualTo(
                            root.get("price"),
                            maxPrice));
        }

        // =========================
        // STOCK FILTER
        // =========================

        if (inStock != null) {

            if (inStock) {

                specification = specification.and(
                        (root, query, criteriaBuilder) -> criteriaBuilder.greaterThan(
                                root.get("stock"),
                                0));

            } else {

                specification = specification.and(
                        (root, query, criteriaBuilder) -> criteriaBuilder.equal(
                                root.get("stock"),
                                0));
            }
        }

        // =========================
        // ACTIVE FILTER
        // =========================

        if (active != null) {

            specification = specification.and(
                    (root, query, criteriaBuilder) -> criteriaBuilder.equal(
                            root.get("active"),
                            active));
        }

        // =========================
        // EXECUTE QUERY
        // =========================

        return productRepository
                .findAll(specification, pageable)
                .map(ProductMapper::toResponse);
    }

    // =========================
    // GET PRODUCT BY ID
    // =========================

    @Override
    public ProductResponse getProductById(Long id) {

        Product product = productRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found"));

        return ProductMapper.toResponse(product);
    }

    // =========================
    // UPDATE PRODUCT
    // =========================

    @Override
    public ProductResponse updateProduct(
            Long id,
            ProductRequest request) {

        Product product = productRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found"));

        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setBrand(request.getBrand());
        product.setImageUrl(request.getImageUrl());
        product.setActive(request.getActive());
        product.setCategory(category);

        Product updatedProduct = productRepository.save(product);

        return ProductMapper.toResponse(updatedProduct);
    }

    // =========================
    // DELETE PRODUCT
    // =========================

    @Override
    public void deleteProduct(Long id) {

        Product product = productRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found"));

        try {

            productRepository.delete(product);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Cannot delete product because it is associated with existing orders.");
        }
    }
}