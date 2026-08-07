package com.ajith.drinkit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ajith.drinkit.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsByName(String name);

}