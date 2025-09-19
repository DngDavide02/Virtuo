package dangelodavide.BackEnd.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

// Questa classe gestisce in modo centralizzato tutte le eccezioni lanciate dai controller
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Gestisce le eccezioni di tipo ResourceNotFoundException
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFound(ResourceNotFoundException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage()); // Inserisce il messaggio dell'eccezione nella mappa
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND); // Ritorna status 404
    }

    // Gestisce gli errori di validazione dei campi (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        // Cicla su tutti gli errori di validazione dei campi e li aggiunge alla mappa
        ex.getBindingResult().getFieldErrors().forEach(err -> errors.put(err.getField(), err.getDefaultMessage()));
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST); // Ritorna status 400
    }

    // Gestisce le eccezioni di accesso negato (es. quando un utente senza ruolo prova a fare operazioni admin)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied(AccessDeniedException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Access denied"); // Messaggio generico di accesso negato
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN); // Ritorna status 403
    }

    // Gestisce tutte le altre eccezioni generiche non catturate dai precedenti handler
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneric(Exception ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Internal server error: " + ex.getMessage()); // Messaggio generico con info eccezione
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR); // Ritorna status 500
    }
}
