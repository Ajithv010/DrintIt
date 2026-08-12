package com.ajith.drinkit.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ajith.drinkit.dto.AddressRequest;
import com.ajith.drinkit.dto.AddressResponse;
import com.ajith.drinkit.entity.Address;
import com.ajith.drinkit.entity.User;
import com.ajith.drinkit.exception.InvalidCartOperationException;
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

        // =========================
        // CREATE ADDRESS
        // =========================

        @Override
        public AddressResponse createAddress(
                        String email,
                        AddressRequest request) {

                User user = getUser(email);

                validateRequest(request);

                Address address = new Address();

                address.setUser(user);

                mapRequestToEntity(request, address);

                Address savedAddress = addressRepository.save(address);

                return toResponse(savedAddress);
        }

        // =========================
        // GET MY ADDRESSES
        // =========================

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

        // =========================
        // GET ADDRESS BY ID
        // =========================

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

        // =========================
        // UPDATE ADDRESS
        // =========================

        @Override
        public AddressResponse updateAddress(
                        String email,
                        Long addressId,
                        AddressRequest request) {

                User user = getUser(email);

                validateRequest(request);

                Address address = addressRepository
                                .findByIdAndUser(addressId, user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Address not found"));

                mapRequestToEntity(request, address);

                Address updatedAddress = addressRepository.save(address);

                return toResponse(updatedAddress);
        }

        // =========================
        // DELETE ADDRESS
        // =========================

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

        // =========================
        // GET USER
        // =========================

        private User getUser(String email) {

                return userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found"));
        }

        // =========================
        // VALIDATE REQUEST
        // =========================

        private void validateRequest(AddressRequest request) {

                if (request == null) {

                        throw new InvalidCartOperationException(
                                        "Address details are required");
                }

                if (isBlank(request.getFullName())) {

                        throw new InvalidCartOperationException(
                                        "Full name is required");
                }

                if (isBlank(request.getPhoneNumber())) {

                        throw new InvalidCartOperationException(
                                        "Phone number is required");
                }

                if (!request.getPhoneNumber().matches(
                                "^[6-9][0-9]{9}$")) {

                        throw new InvalidCartOperationException(
                                        "Phone number must be a valid 10-digit Indian mobile number");
                }

                if (isBlank(request.getAddressLine())) {

                        throw new InvalidCartOperationException(
                                        "Address line is required");
                }

                if (isBlank(request.getCity())) {

                        throw new InvalidCartOperationException(
                                        "City is required");
                }

                if (isBlank(request.getState())) {

                        throw new InvalidCartOperationException(
                                        "State is required");
                }

                if (isBlank(request.getPincode())) {

                        throw new InvalidCartOperationException(
                                        "Pincode is required");
                }

                if (!request.getPincode().matches(
                                "^[1-9][0-9]{5}$")) {

                        throw new InvalidCartOperationException(
                                        "Pincode must be a valid 6-digit number");
                }
        }

        private boolean isBlank(String value) {

                return value == null || value.trim().isEmpty();
        }

        // =========================
        // MAP REQUEST → ENTITY
        // =========================

        private void mapRequestToEntity(
                        AddressRequest request,
                        Address address) {

                address.setFullName(
                                request.getFullName().trim());

                address.setPhoneNumber(
                                request.getPhoneNumber().trim());

                address.setAddressLine(
                                request.getAddressLine().trim());

                address.setCity(
                                request.getCity().trim());

                address.setState(
                                request.getState().trim());

                address.setPincode(
                                request.getPincode().trim());
        }

        // =========================
        // ENTITY → RESPONSE
        // =========================

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