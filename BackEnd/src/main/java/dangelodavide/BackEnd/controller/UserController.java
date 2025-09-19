package dangelodavide.BackEnd.controller;

import dangelodavide.BackEnd.entities.User;
import dangelodavide.BackEnd.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// Indica che questa classe è un controller REST
@RestController
// Tutte le rotte partono da /api/users
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService; // Service per gestire operazioni sugli utenti

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Endpoint PUT per aggiornare lo username di un utente
    @PutMapping("/{id}/username")
    public ResponseEntity<User> updateUsername(@PathVariable Long id, @RequestBody Map<String, String> body) {

        // Estrae il nuovo username dal corpo della richiesta
        String newUsername = body.get("username");

        // Controlla che lo username non sia nullo o vuoto
        if (newUsername == null || newUsername.isBlank()) {
            return ResponseEntity.badRequest().build(); // Ritorna 400 Bad Request se invalido
        }

        try {
            // Chiama il servizio per aggiornare lo username
            User updatedUser = userService.updateUsername(id, newUsername);
            return ResponseEntity.ok(updatedUser); // Ritorna l'utente aggiornato con status 200
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // Ritorna 500 se errore
        }
    }
}
