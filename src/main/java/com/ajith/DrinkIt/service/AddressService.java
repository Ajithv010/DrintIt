package com.ajith.drinkit.service;

import java.util.List;

import com.ajith.drinkit.dto.AddressRequest;
import com.ajith.drinkit.dto.AddressResponse;

public interface AddressService {

    AddressResponse createAddress(
            String email,
            AddressRequest request);

    List<AddressResponse> getMyAddresses(
            String email);

    AddressResponse getAddressById(
            String email,
            Long addressId);

    AddressResponse updateAddress(
            String email,
            Long addressId,
            AddressRequest request);

    void deleteAddress(
            String email,
            Long addressId);
}