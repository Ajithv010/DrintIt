package com.ajith.drinkit.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ajith.drinkit.dto.ProductRequest;
import com.ajith.drinkit.dto.ProductResponse;
import com.ajith.drinkit.entity.Category;
import com.ajith.drinkit.entity.Product;
import com.ajith.drinkit.repository.CategoryRepository;
import com.ajith.drinkit.repository.ProductRepository;
import com.ajith.drinkit.service.ProductService;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(ProductRepository productRepository,
            CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public ProductResponse createProduct(ProductRequest request) {

        if (productRepository.existsByName(request.getName())) {
            throw new RuntimeException("Product already exists");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

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

        return ProductResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .description(saved.getDescription())
                .price(saved.getPrice())
                .stock(saved.getStock())
                .brand(saved.getBrand())
                .imageUrl(saved.getImageUrl())
                .active(saved.getActive())
                .categoryId(saved.getCategory().getId())
                .categoryName(saved.getCategory().getName())
                .build();
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        throw new UnsupportedOperationException("Implement later");
    }

    @Override
    public ProductResponse getProductById(Long id) {
        throw new UnsupportedOperationException("Implement later");
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        throw new UnsupportedOperationException("Implement later");
    }

    @Override
    public void deleteProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        productRepository.delete(product);
    }
}