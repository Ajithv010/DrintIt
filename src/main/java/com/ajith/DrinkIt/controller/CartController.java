package com.ajith.drinkit.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ajith.drinkit.dto.CartResponse;
import com.ajith.drinkit.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public ResponseEntity<CartResponse> addToCart(
            Authentication authentication,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {

        String email = authentication.getName();

        CartResponse cart = cartService.addToCart(
                email,
                productId,
                quantity);

        return new ResponseEntity<>(cart, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                cartService.getCart(email));
    }

    @PutMapping("/update")
    public ResponseEntity<CartResponse> updateQuantity(
            Authentication authentication,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                cartService.updateQuantity(
                        email,
                        productId,
                        quantity));
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeFromCart(
            Authentication authentication,
            @RequestParam Long productId) {

        String email = authentication.getName();

        cartService.removeFromCart(email, productId);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(
            Authentication authentication) {

        String email = authentication.getName();

        cartService.clearCart(email);

        return ResponseEntity.noContent().build();
    }
}