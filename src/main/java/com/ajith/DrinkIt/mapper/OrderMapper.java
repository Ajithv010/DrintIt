package com.ajith.drinkit.mapper;

import java.util.List;

import com.ajith.drinkit.dto.AddressResponse;
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

        AddressResponse address = null;

        if (order.getDeliveryAddress() != null) {

            address = new AddressResponse(
                    order.getDeliveryAddress().getId(),
                    order.getDeliveryAddress().getFullName(),
                    order.getDeliveryAddress().getPhoneNumber(),
                    order.getDeliveryAddress().getAddressLine(),
                    order.getDeliveryAddress().getCity(),
                    order.getDeliveryAddress().getState(),
                    order.getDeliveryAddress().getPincode());
        }

        return new OrderResponse(
                order.getId(),
                order.getCreatedAt(),
                order.getStatus().name(),
                items,
                order.getTotalAmount(),
                address);
    }

    private static OrderItemResponse toItemResponse(
            OrderItem item) {

        Double subtotal = item.getPrice() * item.getQuantity();

        return new OrderItemResponse(
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getPrice(),
                item.getQuantity(),
                subtotal);
    }
}