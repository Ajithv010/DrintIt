package com.ajith.drinkit.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ajith.drinkit.dto.OrderResponse;
import com.ajith.drinkit.service.OrderService;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // =========================
    // GET ALL ORDERS
    // =========================

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {

        return ResponseEntity.ok(
                orderService.getAllOrders());
    }

    // =========================
    // UPDATE ORDER STATUS
    // =========================

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody StatusRequest request) {

        return ResponseEntity.ok(
                orderService.updateOrderStatus(
                        orderId,
                        request.getStatus()));
    }

    // =========================
    // STATUS REQUEST DTO
    // =========================

    public static class StatusRequest {

        private String status;

        public StatusRequest() {
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}