package com.ajith.drinkit.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ajith.drinkit.entity.Order;
import com.ajith.drinkit.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> placeOrder(Authentication authentication) {

        String email = authentication.getName();

        Order order = orderService.placeOrder(email);

        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(orderService.getMyOrders(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(
            Authentication authentication,
            @PathVariable Long id) {

        String email = authentication.getName();

        return ResponseEntity.ok(orderService.getOrderById(email, id));
    }
}