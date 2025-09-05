package dangelodavide.BackEnd.controller;

import dangelodavide.BackEnd.DTO.GameDTO;
import dangelodavide.BackEnd.service.LibraryService;
import dangelodavide.BackEnd.security.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/library")
public class LibraryController {

    private final LibraryService libraryService;

    public LibraryController(LibraryService libraryService) {
        this.libraryService = libraryService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addGame(@RequestBody GameDTO gameDTO,
                                          @AuthenticationPrincipal UserDetailsImpl userDetails) {
        libraryService.addGameToLibrary(userDetails.getId(), gameDTO);
        return ResponseEntity.ok("Game added to library");
    }

    @DeleteMapping("/remove/{gameId}")
    public ResponseEntity<String> removeGame(@PathVariable Long gameId,
                                             @AuthenticationPrincipal UserDetailsImpl userDetails) {
        libraryService.removeGameFromLibrary(userDetails.getId(), gameId);
        return ResponseEntity.ok("Game removed from library");
    }

    @GetMapping
    public ResponseEntity<?> getLibrary(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(libraryService.getLibrary(userDetails.getId()));
    }
}
