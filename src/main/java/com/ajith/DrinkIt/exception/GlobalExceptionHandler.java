package com.ajith.drinkit.exception;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;

import org.springframework.web.bind.MethodArgumentNotValidException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

        // =========================
        // RESOURCE NOT FOUND
        // =========================

        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<Map<String, Object>> handleNotFound(
                        ResourceNotFoundException ex) {

                return buildResponse(
                                HttpStatus.NOT_FOUND,
                                ex.getMessage());
        }

        // =========================
        // INSUFFICIENT STOCK
        // =========================

        @ExceptionHandler(InsufficientStockException.class)
        public ResponseEntity<Map<String, Object>> handleInsufficientStock(
                        InsufficientStockException ex) {

                return buildResponse(
                                HttpStatus.CONFLICT,
                                ex.getMessage());
        }

        // =========================
        // ACCESS DENIED
        // =========================

        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<Map<String, Object>> handleAccessDenied(
                        AccessDeniedException ex) {

                return buildResponse(
                                HttpStatus.FORBIDDEN,
                                ex.getMessage());
        }

        // =========================
        // AUTHENTICATION
        // =========================

        @ExceptionHandler(AuthenticationException.class)
        public ResponseEntity<Map<String, Object>> handleAuthenticationException(
                        AuthenticationException ex) {

                return buildResponse(
                                HttpStatus.UNAUTHORIZED,
                                ex.getMessage());
        }

        // =========================
        // INVALID CART OPERATION
        // =========================

        @ExceptionHandler(InvalidCartOperationException.class)
        public ResponseEntity<Map<String, Object>> handleInvalidCartOperation(
                        InvalidCartOperationException ex) {

                return buildResponse(
                                HttpStatus.BAD_REQUEST,
                                ex.getMessage());
        }

        // =========================
        // INVALID ORDER STATUS
        // =========================

        @ExceptionHandler(InvalidOrderStatusException.class)
        public ResponseEntity<Map<String, Object>> handleInvalidOrderStatus(
                        InvalidOrderStatusException ex) {

                return buildResponse(
                                HttpStatus.BAD_REQUEST,
                                ex.getMessage());
        }

        // =========================
        // OTHER RUNTIME EXCEPTIONS
        // =========================

        @ExceptionHandler(RuntimeException.class)
        public ResponseEntity<Map<String, Object>> handleRuntimeException(
                        RuntimeException ex) {

                return buildResponse(
                                HttpStatus.BAD_REQUEST,
                                ex.getMessage());
        }

        // =========================
        // COMMON RESPONSE
        // =========================

        private ResponseEntity<Map<String, Object>> buildResponse(
                        HttpStatus status,
                        String message) {

                Map<String, Object> response = Map.of(
                                "timestamp", LocalDateTime.now(),
                                "status", status.value(),
                                "error", status.getReasonPhrase(),
                                "message", message);

                return ResponseEntity
                                .status(status)
                                .body(response);
        }

        @ExceptionHandler(InvalidPaymentException.class)
        public ResponseEntity<Map<String, Object>> handleInvalidPayment(
                        InvalidPaymentException ex) {

                return buildResponse(
                                HttpStatus.BAD_REQUEST,
                                ex.getMessage());
        }
        // =========================
        // VALIDATION ERRORS
        // =========================

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<Map<String, Object>> handleValidationException(
                        MethodArgumentNotValidException ex) {

                Map<String, String> errors = new HashMap<>();

                ex.getBindingResult()
                                .getFieldErrors()
                                .forEach(error -> errors.put(
                                                error.getField(),
                                                error.getDefaultMessage()));

                Map<String, Object> response = Map.of(
                                "timestamp", LocalDateTime.now(),
                                "status", HttpStatus.BAD_REQUEST.value(),
                                "error", HttpStatus.BAD_REQUEST.getReasonPhrase(),
                                "message", "Validation failed",
                                "errors", errors);

                return ResponseEntity
                                .badRequest()
                                .body(response);
        }
}