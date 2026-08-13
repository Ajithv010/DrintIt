package com.ajith.drinkit.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

        // ========================================
        // CUSTOMER - PLACE ORDER
        // ========================================

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

        // ========================================
        // ADMIN - GET ALL ORDERS
        // ========================================

        @GetMapping("/admin/all")
        public ResponseEntity<List<OrderResponse>> getAllOrders() {

                return ResponseEntity.ok(
                                orderService.getAllOrders());
        }

        // ========================================
        // ADMIN - GET ORDER DETAILS
        // ========================================

        @GetMapping("/admin/{orderId}")
        public ResponseEntity<OrderResponse> getAdminOrderById(
                        @PathVariable Long orderId) {

                return ResponseEntity.ok(
                                orderService.getAdminOrderById(
                                                orderId));
        }

        // ========================================
        // ADMIN - UPDATE ORDER STATUS
        // ========================================

        @PutMapping("/{orderId}/status")
        public ResponseEntity<OrderResponse> updateOrderStatus(
                        @PathVariable Long orderId,
                        @RequestParam String status) {

                return ResponseEntity.ok(
                                orderService.updateOrderStatus(
                                                orderId,
                                                status));
        }

        // ========================================
        // CUSTOMER - GET MY ORDERS
        // ========================================

        @GetMapping
        public ResponseEntity<List<OrderResponse>> getMyOrders(
                        Authentication authentication) {

                User user = (User) authentication.getPrincipal();

                return ResponseEntity.ok(
                                orderService.getMyOrders(
                                                user.getEmail()));
        }

        // ========================================
        // CUSTOMER - GET MY ORDER BY ID
        // ========================================

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

        // ========================================
        // CUSTOMER - CANCEL ORDER
        // ========================================

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

        // ========================================
        // CUSTOMER - CANCEL ORDER
        // ========================================

        @PutMapping("/{orderId}/cancel")
        public ResponseEntity<OrderResponse> cancelOrderWithPut(
                        Authentication authentication,
                        @PathVariable Long orderId) {

                User user = (User) authentication.getPrincipal();

                return ResponseEntity.ok(
                                orderService.cancelOrder(
                                                user.getEmail(),
                                                orderId));
        }
}