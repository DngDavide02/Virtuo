package dangelodavide.BackEnd.controller;

import dangelodavide.BackEnd.DTO.GameDTO;
import dangelodavide.BackEnd.entities.User;
import dangelodavide.BackEnd.security.UserDetailsImpl;
import dangelodavide.BackEnd.security.UserDetailsServiceImpl;
import dangelodavide.BackEnd.service.LibraryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

// Indica che questa classe è un controller REST
@RestController
// Tutte le rotte partono da /api/library
@RequestMapping("/api/library")
public class LibraryController {

    private final LibraryService libraryService; // Service per gestire la libreria
    private final UserDetailsServiceImpl userDetailsService; // Service per ottenere l'entità User

    public LibraryController(LibraryService libraryService, UserDetailsServiceImpl userDetailsService) {
        this.libraryService = libraryService;
        this.userDetailsService = userDetailsService;
    }

    // Endpoint POST per aggiungere un gioco alla libreria dell'utente
    @PostMapping("/add")
    public ResponseEntity<?> addGameToLibrary(@RequestBody GameDTO gameDTO,
                                              @AuthenticationPrincipal UserDetailsImpl userDetails) {

        // Controllo se l'utente è autenticato
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        // Recupera l'entità User dal servizio
        User user = userDetailsService.loadUserEntityByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        try {
            libraryService.addGameToLibrary(user, gameDTO); // Aggiunge il gioco alla libreria
            return ResponseEntity.ok("Game added to library");
        } catch (RuntimeException e) {
            // Gestione caso gioco già presente
            if (e.getMessage().equals("Game already in library")) {
                return ResponseEntity.status(409).body("Game already in library");
            }
            return ResponseEntity.status(500).body("Error adding game"); // Errore generico
        }
    }

    // Endpoint GET per ottenere tutti i giochi presenti nella libreria dell'utente
    @GetMapping
    public ResponseEntity<?> getUserLibrary(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized"); // Utente non autenticato
        }

        try {
            var games = libraryService.getLibraryGamesByUser(userDetails.getUsername()); // Recupera giochi
            return ResponseEntity.ok(games); // Ritorna lista dei giochi con status 200
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching library"); // Errore generico
        }
    }

    // Endpoint DELETE per rimuovere un gioco dalla libreria dell'utente
    @DeleteMapping("/remove/{gameId}")
    public ResponseEntity<?> removeGameFromLibrary(
            @PathVariable Integer gameId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized"); // Utente non autenticato
        }

        User user = userDetailsService.loadUserEntityByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized"); // Utente non trovato
        }

        try {
            libraryService.removeGameFromLibrary(user, gameId); // Rimuove gioco dalla libreria
            return ResponseEntity.ok("Game removed from library");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error removing game"); // Errore generico
        }
    }

}
