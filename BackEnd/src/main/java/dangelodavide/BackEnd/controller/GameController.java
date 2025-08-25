package dangelodavide.BackEnd.controller;

import dangelodavide.BackEnd.entities.Game;
import dangelodavide.BackEnd.service.GameService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) { this.gameService = gameService; }

    @GetMapping
    public List<Game> getAll() { return gameService.getAllGames(); }

    @GetMapping("/{id}")
    public Game get(@PathVariable Long id) { return gameService.getGame(id); }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Game create(@RequestBody Game game) { return gameService.addGame(game); }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Game update(@PathVariable Long id, @RequestBody Game game) { return gameService.editGame(id, game); }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) { gameService.deleteGame(id); }
}

