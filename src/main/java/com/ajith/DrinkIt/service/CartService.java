package com.ajith.drinkit.service;

import com.ajith.drinkit.entity.Cart;

public interface CartService {

    Cart addToCart(String email, Long productId, Integer quantity);

    Cart getCart(String email);

    Cart updateQuantity(String email, Long productId, Integer quantity);

    void removeFromCart(String email, Long productId);

    void clearCart(String email);
}