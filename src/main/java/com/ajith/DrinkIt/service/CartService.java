package com.ajith.drinkit.service;

import com.ajith.drinkit.dto.CartResponse;

public interface CartService {

    CartResponse addToCart(
            String email,
            Long productId,
            Integer quantity);

    CartResponse getCart(
            String email);

    CartResponse updateQuantity(
            String email,
            Long productId,
            Integer quantity);

    void removeFromCart(
            String email,
            Long productId);

    void clearCart(
            String email);
}