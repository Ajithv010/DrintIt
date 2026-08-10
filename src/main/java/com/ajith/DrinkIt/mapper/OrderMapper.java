package com.ajith.drinkit.mapper;

import java.util.List;

import com.ajith.drinkit.dto.OrderItemResponse;
import com.ajith.drinkit.dto.OrderResponse;
import com.ajith.drinkit.entity.Order;
import com.ajith.drinkit.entity.OrderItem;

public class OrderMapper {

    private OrderMapper() {
        // Utility class
    }

    public static OrderResponse toResponse(Order order) {

        List<OrderItemResponse> items = order.getItems()
                .stream()
                .map(OrderMapper::toItemResponse)
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getOrderDate(),
                order.getStatus(),
                items,
                order.getTotalAmount());
    }

    private static OrderItemResponse toItemResponse(OrderItem item) {

        Double subtotal = item.getPrice() * item.getQuantity();

        return new OrderItemResponse(
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getPrice(),
                item.getQuantity(),
                subtotal);
    }
}