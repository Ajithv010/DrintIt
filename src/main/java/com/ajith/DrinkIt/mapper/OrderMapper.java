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

        // =========================
        // ORDER ITEMS
        // =========================

        List<OrderItemResponse> items = order.getItems()
                .stream()
                .map(OrderMapper::toItemResponse)
                .toList();

        // =========================
        // CUSTOMER
        // =========================

        String customerName = null;
        String customerEmail = null;
        String customerPhone = null;

        if (order.getUser() != null) {

            customerName = ((order.getUser().getFirstName() != null
                    ? order.getUser().getFirstName()
                    : "")
                    + " "
                    + (order.getUser().getLastName() != null
                            ? order.getUser().getLastName()
                            : ""))
                    .trim();

            customerEmail = order.getUser().getEmail();

            customerPhone = order.getUser().getPhoneNumber();
        }

        // =========================
        // DELIVERY ADDRESS
        // =========================

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

        // =========================
        // RESPONSE
        // =========================

        return new OrderResponse(
                order.getId(),
                order.getCreatedAt(),
                order.getStatus().name(),

                customerName,
                customerEmail,
                customerPhone,

                items,

                order.getTotalAmount(),

                address);
    }

    // =========================
    // ORDER ITEM → RESPONSE
    // =========================

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