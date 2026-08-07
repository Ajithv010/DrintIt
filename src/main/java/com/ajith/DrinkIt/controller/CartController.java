package com.ajith.drinkit.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ajith.drinkit.entity.Cart;
import com.ajith.drinkit.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
            Authentication authentication,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {

        String email = authentication.getName();

        Cart cart = cartService.addToCart(email, productId, quantity);

        return new ResponseEntity<>(cart, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Cart> getCart(Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(cartService.getCart(email));
    }

    @PutMapping("/update")
    public ResponseEntity<Cart> updateQuantity(
            Authentication authentication,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                cartService.updateQuantity(email, productId, quantity));
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeFromCart(
            Authentication authentication,
            @RequestParam Long productId) {

        String email = authentication.getName();

        cartService.removeFromCart(email, productId);

        return ResponseEntity.noContent().build();
    }
}