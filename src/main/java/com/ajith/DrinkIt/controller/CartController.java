package com.ajith.drinkit.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ajith.drinkit.dto.CartResponse;
import com.ajith.drinkit.entity.User;
import com.ajith.drinkit.service.CartService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // =========================
    // GET CURRENT USER CART
    // =========================

    @GetMapping
    public ResponseEntity<CartResponse> getCart(
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        String email = user.getEmail();

        return ResponseEntity.ok(
                cartService.getCart(email));
    }

    // =========================
    // ADD PRODUCT TO CART
    // =========================

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(
            Authentication authentication,
            @Valid @RequestBody CartAddRequest request) {

        User user = (User) authentication.getPrincipal();

        String email = user.getEmail();

        CartResponse cart = cartService.addToCart(
                email,
                request.getProductId(),
                request.getQuantity());

        return new ResponseEntity<>(
                cart,
                HttpStatus.CREATED);
    }

    // =========================
    // UPDATE CART ITEM
    // =========================

    @PutMapping("/items/{productId}")
    public ResponseEntity<CartResponse> updateQuantity(
            Authentication authentication,
            @PathVariable Long productId,
            @Valid @RequestBody CartQuantityRequest request) {

        User user = (User) authentication.getPrincipal();

        String email = user.getEmail();

        return ResponseEntity.ok(
                cartService.updateQuantity(
                        email,
                        productId,
                        request.getQuantity()));
    }

    // =========================
    // REMOVE CART ITEM
    // =========================

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Void> removeFromCart(
            Authentication authentication,
            @PathVariable Long productId) {

        User user = (User) authentication.getPrincipal();

        String email = user.getEmail();

        cartService.removeFromCart(
                email,
                productId);

        return ResponseEntity.noContent().build();
    }

    // =========================
    // CLEAR CART
    // =========================

    @DeleteMapping
    public ResponseEntity<Void> clearCart(
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        String email = user.getEmail();

        cartService.clearCart(email);

        return ResponseEntity.noContent().build();
    }

    // =========================
    // ADD TO CART REQUEST
    // =========================

    public static class CartAddRequest {

        @NotNull(message = "Product ID is required")
        @Positive(message = "Product ID must be greater than zero")
        private Long productId;

        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be greater than zero")
        private Integer quantity;

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }

    // =========================
    // UPDATE QUANTITY REQUEST
    // =========================

    public static class CartQuantityRequest {

        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be greater than zero")
        private Integer quantity;

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}