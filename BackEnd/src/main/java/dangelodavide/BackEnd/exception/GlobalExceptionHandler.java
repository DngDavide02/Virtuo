package dangelodavide.BackEnd.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

// This class centrally handles all exceptions thrown by controllers
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handles ResourceNotFoundException exceptions
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFound(ResourceNotFoundException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage()); // Inserts exception message in map
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND); // Returns 404 status
    }

    // Handles field validation errors (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        // Loop through all field validation errors and add them to map
        ex.getBindingResult().getFieldErrors().forEach(err -> errors.put(err.getField(), err.getDefaultMessage()));
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST); // Returns 400 status
    }

    // Handles access denied exceptions (e.g., when user without role tries admin operations)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied(AccessDeniedException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Access denied"); // Generic access denied message
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN); // Returns 403 status
    }

    // Handles all other generic exceptions not caught by previous handlers
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneric(Exception ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Internal server error: " + ex.getMessage()); // Generic message with exception info
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR); // Returns 500 status
    }
}
