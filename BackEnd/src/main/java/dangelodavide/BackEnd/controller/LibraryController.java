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

        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        User user = userDetailsService.loadUserEntityByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        try {
            libraryService.addGameToLibrary(user, gameDTO);
            return ResponseEntity.ok("Game added to library");
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Game already in library")) {
                return ResponseEntity.status(409).body("Game already in library");
            }
            return ResponseEntity.status(500).body("Error adding game");
        }
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
            return ResponseEntity.status(500).body("Error removing game");
        }
    }

}
