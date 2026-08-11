package com.ajith.drinkit.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ajith.drinkit.dto.AddressRequest;
import com.ajith.drinkit.dto.AddressResponse;
import com.ajith.drinkit.entity.Address;
import com.ajith.drinkit.entity.User;
import com.ajith.drinkit.exception.ResourceNotFoundException;
import com.ajith.drinkit.repository.AddressRepository;
import com.ajith.drinkit.repository.UserRepository;
import com.ajith.drinkit.service.AddressService;

@Service
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressServiceImpl(
            AddressRepository addressRepository,
            UserRepository userRepository) {

        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Override
    public AddressResponse createAddress(
            String email,
            AddressRequest request) {

        User user = getUser(email);

        Address address = new Address();

        address.setUser(user);

        mapRequestToEntity(request, address);

        Address savedAddress = addressRepository.save(address);

        return toResponse(savedAddress);
    }

    @Override
    public List<AddressResponse> getMyAddresses(
            String email) {

        User user = getUser(email);

        return addressRepository
                .findByUser(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public AddressResponse getAddressById(
            String email,
            Long addressId) {

        User user = getUser(email);

        Address address = addressRepository
                .findByIdAndUser(addressId, user)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Address not found"));

        return toResponse(address);
    }

    @Override
    public AddressResponse updateAddress(
            String email,
            Long addressId,
            AddressRequest request) {

        User user = getUser(email);

        Address address = addressRepository
                .findByIdAndUser(addressId, user)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Address not found"));

        mapRequestToEntity(request, address);

        Address updatedAddress = addressRepository.save(address);

        return toResponse(updatedAddress);
    }

    @Override
    public void deleteAddress(
            String email,
            Long addressId) {

        User user = getUser(email);

        Address address = addressRepository
                .findByIdAndUser(addressId, user)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Address not found"));

        addressRepository.delete(address);
    }

    private User getUser(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found"));
    }

    private void mapRequestToEntity(
            AddressRequest request,
            Address address) {

        address.setFullName(request.getFullName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setAddressLine(request.getAddressLine());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
    }

    private AddressResponse toResponse(
            Address address) {

        return new AddressResponse(
                address.getId(),
                address.getFullName(),
                address.getPhoneNumber(),
                address.getAddressLine(),
                address.getCity(),
                address.getState(),
                address.getPincode());
    }
}