package dangelodavide.BackEnd.controller;

import dangelodavide.BackEnd.DTO.GameDTO;
import dangelodavide.BackEnd.DTO.GenreDTO;
import dangelodavide.BackEnd.DTO.PlatformDTO;
import dangelodavide.BackEnd.entities.Game;
import dangelodavide.BackEnd.service.GameService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    // --- DB CRUD ---
    @GetMapping
    public List<Game> getAll() {
        return gameService.getAllGames();
    }

    @GetMapping("/{id}")
    public Game get(@PathVariable Long id) {
        return gameService.getGame(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Game create(@RequestBody Game game) {
        return gameService.addGame(game);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Game update(@PathVariable Long id, @RequestBody Game game) {
        return gameService.editGame(id, game);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        gameService.deleteGame(id);
    }

    // --- RAWG API ---

    @GetMapping("/rawg/filter")
    public List<GameDTO> getFilteredGames(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int pageSize,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String genres,
            @RequestParam(required = false) String platforms,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String ordering
    ) {
        return gameService.getGamesWithFilters(page, pageSize, search, genres, platforms, year, ordering);
    }

    @GetMapping("/rawg/{id}")
    public GameDTO getGameFromApi(@PathVariable String id) {
        return gameService.getGameFromApi(id);
    }

    @GetMapping("/rawg/top-rated")
    public List<GameDTO> getTopRated(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "8") int pageSize) {
        return gameService.getTopRatedPopular(page, pageSize);
    }

    @GetMapping("/rawg/coming-soon")
    public List<GameDTO> getComingSoon(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "8") int pageSize) {
        return gameService.getComingSoonPopular(page, pageSize);
    }

    @GetMapping("/rawg/featured")
    public List<GameDTO> getFeaturedGames(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int pageSize) {
        return gameService.getFeaturedGames(page, pageSize);
    }

    // --- RAWG Filters ---
    @GetMapping("/genres")
    public List<GenreDTO> getGenres(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int pageSize,
            @RequestParam(required = false) String ordering) {
        return gameService.getGenres(page, pageSize, ordering);
    }

    @GetMapping("/platforms")
    public List<PlatformDTO> getPlatforms(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int pageSize,
            @RequestParam(required = false) String ordering) {
        return gameService.getPlatforms(page, pageSize, ordering);
    }

    @GetMapping("/rawg/populate")
    public String populateGames(@RequestParam(defaultValue = "1") int page,
                                @RequestParam(defaultValue = "50") int pageSize) {
        gameService.populateGamesFromRawg(page, pageSize);
        return "Games populated in DB with full description";
    }


}
