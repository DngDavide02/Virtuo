package dangelodavide.BackEnd.controller;

import dangelodavide.BackEnd.entities.Game;
import dangelodavide.BackEnd.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Indica che questa classe è un controller REST
@RestController
// Tutte le rotte partono da /api/games
@RequestMapping("/api/games")
public class GameController {

    // Service che gestisce la logica dei giochi
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    // Endpoint GET per ottenere tutti i giochi gratuiti filtrabili
    // Optional: piattaforma, categoria e ordinamento
    @GetMapping
    public ResponseEntity<List<Game>> getFreeGames(
            @RequestParam(required = false) String platform,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sortBy
    ) {
        // Richiama il service e ritorna la lista dei giochi con status 200 OK
        return ResponseEntity.ok(gameService.getFreeGames(platform, category, sortBy));
    }

    // Endpoint GET per ottenere i dettagli di un gioco tramite ID
    @GetMapping("/{id}")
    public ResponseEntity<Game> getGameById(@PathVariable Integer id) {
        // Richiama il service per ottenere i dettagli del gioco
        return ResponseEntity.ok(gameService.getGameDetails(id));
    }

    // Endpoint GET per cercare giochi tramite query string
    @GetMapping("/search")
    public ResponseEntity<List<Game>> searchGames(@RequestParam String q) {
        // Richiama il service per cercare i giochi e ritorna il risultato
        return ResponseEntity.ok(gameService.searchGames(q));
    }
}
