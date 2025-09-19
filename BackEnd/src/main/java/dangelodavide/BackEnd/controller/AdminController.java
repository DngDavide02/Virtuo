package dangelodavide.BackEnd.controller;

import dangelodavide.BackEnd.entities.User; // importa l'entità User
import dangelodavide.BackEnd.repository.UserRepository; // importa il repository per accedere al DB
import org.springframework.http.ResponseEntity; // permette di costruire risposte HTTP personalizzate
import org.springframework.security.access.prepost.PreAuthorize; // per controllare i permessi di accesso
import org.springframework.web.bind.annotation.*; // importa le annotazioni REST

import java.util.List; // per le liste di utenti
import java.util.Optional; // per gestire oggetti che possono essere null

// Indica che questa classe è un controller REST e gestisce le richieste HTTP
@RestController
// Tutte le rotte all'interno di questo controller iniziano con /api/admin/users
@RequestMapping("/api/admin/users")
// Autorizza solo gli utenti con ruolo ADMIN ad accedere a questo controller
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository; // repository per gestire gli utenti nel DB

    // Costruttore del controller con dependency injection del repository
    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // --- OPERAZIONI CRUD ---

    // GET /api/admin/users
    // Restituisce la lista di tutti gli utenti presenti nel database
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll(); // trova tutti gli utenti
    }

    // GET /api/admin/users/{id}
    // Restituisce un singolo utente dato il suo ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id); // cerca utente per ID
        // Se l'utente esiste, restituisci OK con l'utente, altrimenti NotFound
        return userOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // PUT /api/admin/users/{id}
    // Aggiorna il ruolo di un utente
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        // Cerca l'utente da aggiornare
        return userRepository.findById(id)
                .map(user -> {
                    // Aggiorna solo il ruolo se presente nella richiesta
                    if (updatedUser.getRole() != null) {
                        user.setRole(updatedUser.getRole());
                    }
                    userRepository.save(user); // salva le modifiche nel DB
                    return ResponseEntity.ok(user); // restituisci utente aggiornato
                })
                // Se l'utente non esiste, restituisci NotFound
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE /api/admin/users/{id}
    // Elimina un utente dal database
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user); // elimina l'utente
                    return ResponseEntity.noContent().<Void>build(); // risposta 204 No Content
                })
                // Se l'utente non esiste, restituisci NotFound
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
