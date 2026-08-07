package com.ajith.drinkit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ajith.drinkit.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}