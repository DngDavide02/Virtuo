package dangelodavide.BackEnd.controller;

import dangelodavide.BackEnd.entities.Game;
import dangelodavide.BackEnd.service.LibraryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/library")
public class LibraryController {

    private final LibraryService libraryService;

    public LibraryController(LibraryService libraryService) {
        this.libraryService = libraryService;
    }

    @PostMapping("/{userId}/add/{gameId}")
    public ResponseEntity<String> addGame(@PathVariable Long userId, @PathVariable Long gameId) {
        libraryService.addGameToLibrary(userId, gameId);
        return ResponseEntity.ok("Game added to library!");
    }

    @DeleteMapping("/{userId}/remove/{gameId}")
    public ResponseEntity<String> removeGame(@PathVariable Long userId, @PathVariable Long gameId) {
        libraryService.removeGameFromLibrary(userId, gameId);
        return ResponseEntity.ok("Game removed from library!");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Set<Game>> getLibrary(@PathVariable Long userId) {
        return ResponseEntity.ok(libraryService.getLibrary(userId));
    }
}
