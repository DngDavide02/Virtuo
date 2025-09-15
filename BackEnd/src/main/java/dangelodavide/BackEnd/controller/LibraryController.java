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
}
