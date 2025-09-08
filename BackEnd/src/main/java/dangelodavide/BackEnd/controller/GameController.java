package dangelodavide.BackEnd.controller;

import dangelodavide.BackEnd.entities.Game;
import dangelodavide.BackEnd.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping
    public ResponseEntity<List<Game>> getFreeGames(
            @RequestParam(required = false) String platform,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sortBy
    ) {
        return ResponseEntity.ok(gameService.getFreeGames(platform, category, sortBy));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Game> getGameById(@PathVariable Integer id) {
        return ResponseEntity.ok(gameService.getGameDetails(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Game>> searchGames(@RequestParam String q) {
        return ResponseEntity.ok(gameService.searchGames(q));
    }
}
