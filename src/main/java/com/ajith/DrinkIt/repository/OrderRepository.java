package com.ajith.drinkit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ajith.drinkit.entity.Order;
import com.ajith.drinkit.entity.User;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUser(User user);

}