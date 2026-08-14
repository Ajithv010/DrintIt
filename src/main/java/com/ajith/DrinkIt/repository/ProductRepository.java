package com.ajith.drinkit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.ajith.drinkit.entity.Product;

public interface ProductRepository
        extends JpaRepository<Product, Long>,
        JpaSpecificationExecutor<Product> {

    boolean existsByName(String name);

    // Get only active products
    List<Product> findByActiveTrue();
}