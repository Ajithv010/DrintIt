package com.ajith.drinkit.service;

import java.util.List;

import com.ajith.drinkit.dto.OrderResponse;

public interface OrderService {

        // ========================================
        // CUSTOMER - PLACE ORDER
        // ========================================

        OrderResponse placeOrder(
                        String email,
                        Long addressId);

        // ========================================
        // CUSTOMER - GET MY ORDERS
        // ========================================

        List<OrderResponse> getMyOrders(
                        String email);

        // ========================================
        // CUSTOMER - GET MY ORDER BY ID
        // ========================================

        OrderResponse getOrderById(
                        String email,
                        Long orderId);

        // ========================================
        // CUSTOMER - CANCEL ORDER
        // ========================================

        OrderResponse cancelOrder(
                        String email,
                        Long orderId);

        // ========================================
        // ADMIN - GET ALL ORDERS
        // ========================================

        List<OrderResponse> getAllOrders();

        // ========================================
        // ADMIN - GET ORDER BY ID
        // ========================================

        OrderResponse getAdminOrderById(
                        Long orderId);

        // ========================================
        // ADMIN - UPDATE ORDER STATUS
        // ========================================

        OrderResponse updateOrderStatus(
                        Long orderId,
                        String status);
}