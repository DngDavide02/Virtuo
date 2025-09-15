package dangelodavide.BackEnd.controller;

import dangelodavide.BackEnd.DTO.GameDTO;
import dangelodavide.BackEnd.entities.User;
import dangelodavide.BackEnd.security.UserDetailsImpl;
import dangelodavide.BackEnd.security.UserDetailsServiceImpl;
import dangelodavide.BackEnd.service.LibraryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/library")
public class LibraryController {

    private final LibraryService libraryService;
    private final UserDetailsServiceImpl userDetailsService;

    public LibraryController(LibraryService libraryService, UserDetailsServiceImpl userDetailsService) {
        this.libraryService = libraryService;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addGameToLibrary(@RequestBody GameDTO gameDTO,
                                              @AuthenticationPrincipal UserDetailsImpl userDetails) {
        System.out.println("[DEBUG] Controller /add called");

        if (userDetails == null) {
            System.out.println("[DEBUG] UserDetails is null -> Unauthorized");
            return ResponseEntity.status(401).body("Unauthorized");
        }

        System.out.println("[DEBUG] Authenticated user: " + userDetails.getUsername());

        // Recupera l'entità User reale dal database tramite UserDetailsService
        User user = userDetailsService.loadUserEntityByUsername(userDetails.getUsername());
        if (user == null) {
            System.out.println("[DEBUG] User entity not found -> Unauthorized");
            return ResponseEntity.status(401).body("Unauthorized");
        }

        System.out.println("[DEBUG] Adding game: " + gameDTO.title());

        libraryService.addGameToLibrary(user, gameDTO);

        return ResponseEntity.ok("Game added to library");
    }

    @GetMapping
    public ResponseEntity<?> getUserLibrary(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        try {
            var games = libraryService.getLibraryGamesByUser(userDetails.getUsername());
            return ResponseEntity.ok(games);
        } catch (Exception e) {
            System.out.println("[DEBUG] Error fetching library: " + e.getMessage());
            return ResponseEntity.status(500).body("Error fetching library");
        }
    }

    @DeleteMapping("/remove/{gameId}")
    public ResponseEntity<?> removeGameFromLibrary(
            @PathVariable Integer gameId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        User user = userDetailsService.loadUserEntityByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        try {
            libraryService.removeGameFromLibrary(user, gameId);
            return ResponseEntity.ok("Game removed from library");
        } catch (Exception e) {
            System.out.println("[DEBUG] Error removing game: " + e.getMessage());
            return ResponseEntity.status(500).body("Error removing game");
        }
    }

}
