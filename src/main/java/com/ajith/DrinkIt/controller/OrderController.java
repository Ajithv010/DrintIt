package com.ajith.drinkit.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ajith.drinkit.dto.OrderResponse;
import com.ajith.drinkit.entity.User;
import com.ajith.drinkit.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

        private final OrderService orderService;

        public OrderController(OrderService orderService) {
                this.orderService = orderService;
        }

        // =========================
        // PLACE ORDER
        // =========================

        @PostMapping
        public ResponseEntity<OrderResponse> placeOrder(
                        Authentication authentication,
                        @RequestParam Long addressId) {

                User user = (User) authentication.getPrincipal();

                OrderResponse response = orderService.placeOrder(
                                user.getEmail(),
                                addressId);

                return new ResponseEntity<>(
                                response,
                                HttpStatus.CREATED);
        }

        // =========================
        // GET MY ORDERS
        // =========================

        @GetMapping
        public ResponseEntity<List<OrderResponse>> getMyOrders(
                        Authentication authentication) {

                User user = (User) authentication.getPrincipal();

                return ResponseEntity.ok(
                                orderService.getMyOrders(
                                                user.getEmail()));
        }

        // =========================
        // GET MY ORDER BY ID
        // =========================

        @GetMapping("/{orderId}")
        public ResponseEntity<OrderResponse> getOrderById(
                        Authentication authentication,
                        @PathVariable Long orderId) {

                User user = (User) authentication.getPrincipal();

                return ResponseEntity.ok(
                                orderService.getOrderById(
                                                user.getEmail(),
                                                orderId));
        }

        // =========================
        // CANCEL MY ORDER
        // =========================

        @DeleteMapping("/{orderId}")
        public ResponseEntity<OrderResponse> cancelOrder(
                        Authentication authentication,
                        @PathVariable Long orderId) {

                User user = (User) authentication.getPrincipal();

                return ResponseEntity.ok(
                                orderService.cancelOrder(
                                                user.getEmail(),
                                                orderId));
        }
        // =========================
        // ADMIN - UPDATE ORDER STATUS
        // =========================

        @PutMapping("/{orderId}/status")
        public ResponseEntity<OrderResponse> updateOrderStatus(
                        @PathVariable Long orderId,
                        @RequestParam String status) {

                return ResponseEntity.ok(
                                orderService.updateOrderStatus(
                                                orderId,
                                                status));
        }
}