package com.ajith.drinkit.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ajith.drinkit.dto.AddressRequest;
import com.ajith.drinkit.dto.AddressResponse;
import com.ajith.drinkit.entity.User;
import com.ajith.drinkit.service.AddressService;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(
            AddressService addressService) {

        this.addressService = addressService;
    }

    @PostMapping
    public ResponseEntity<AddressResponse> createAddress(
            Authentication authentication,
            @RequestBody AddressRequest request) {

        User user = (User) authentication.getPrincipal();

        AddressResponse response = addressService.createAddress(
                user.getEmail(),
                request);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getMyAddresses(
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                addressService.getMyAddresses(
                        user.getEmail()));
    }

    @GetMapping("/{addressId}")
    public ResponseEntity<AddressResponse> getAddressById(
            Authentication authentication,
            @PathVariable Long addressId) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                addressService.getAddressById(
                        user.getEmail(),
                        addressId));
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<AddressResponse> updateAddress(
            Authentication authentication,
            @PathVariable Long addressId,
            @RequestBody AddressRequest request) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                addressService.updateAddress(
                        user.getEmail(),
                        addressId,
                        request));
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            Authentication authentication,
            @PathVariable Long addressId) {

        User user = (User) authentication.getPrincipal();

        addressService.deleteAddress(
                user.getEmail(),
                addressId);

        return ResponseEntity.noContent().build();
    }
}