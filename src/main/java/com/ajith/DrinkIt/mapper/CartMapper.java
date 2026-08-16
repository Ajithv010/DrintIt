package com.ajith.drinkit.mapper;

import java.util.List;

import com.ajith.drinkit.dto.CartItemResponse;
import com.ajith.drinkit.dto.CartResponse;
import com.ajith.drinkit.entity.Cart;
import com.ajith.drinkit.entity.CartItem;

public class CartMapper {

    private CartMapper() {
        // Utility class
    }

    public static CartResponse toResponse(Cart cart) {

        List<CartItemResponse> items = cart.getItems()
                .stream()
                .map(CartMapper::toItemResponse)
                .toList();

        double totalAmount = items.stream()
                .mapToDouble(item -> item.getSubtotal())
                .sum();

        return new CartResponse(
                cart.getId(),
                cart.getUser().getId(),
                items,
                totalAmount);
    }

    private static CartItemResponse toItemResponse(CartItem item) {

        Double price = item.getProduct().getPrice();

        Double subtotal = price * item.getQuantity();

        String imageUrl = item.getProduct().getImageUrl();

        return new CartItemResponse(
                item.getProduct().getId(),
                item.getProduct().getName(),
                price,
                item.getQuantity(),
                subtotal,
                imageUrl);
    }
}