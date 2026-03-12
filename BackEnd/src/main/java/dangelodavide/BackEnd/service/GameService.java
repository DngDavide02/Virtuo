package dangelodavide.BackEnd.service;

import dangelodavide.BackEnd.DTO.GameDTO;
import dangelodavide.BackEnd.entities.Game;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GameService {

    private final RestTemplate restTemplate = new RestTemplate(); // For making HTTP requests
    private final String BASE_URL = "https://www.freetogame.com/api"; // Base URL of free-to-game API
    private final Random random = new Random(); // For generating random ratings

    // Retrieves list of free games from API with optional filters: platform, category and sortBy
    public List<Game> getFreeGames(String platform, String category, String sortBy) {
        String url = BASE_URL + "/games";
        if (platform != null) url += (url.contains("?") ? "&" : "?") + "platform=" + platform;
        if (category != null) url += (url.contains("?") ? "&" : "?") + "category=" + category;
        if (sortBy != null) url += (url.contains("?") ? "&" : "?") + "sort-by=" + sortBy;

        // GET call to external API and mapping to Game array
        Game[] games = restTemplate.getForObject(url, Game[].class);

        if (games != null) {
            // Adds a random rating between 2.5 and 5 for each game
            return Arrays.stream(games)
                    .peek(g -> g.setRating(2.5 + random.nextDouble() * 2.5))
                    .collect(Collectors.toList());
        }
        return List.of(); // Returns empty list if no games found
    }

    // Retrieves details of a single game from API
    public Game getGameDetails(Integer id) {
        String url = BASE_URL + "/game?id=" + id;

        // GET call to obtain a GameDTO
        GameDTO gameDTO = restTemplate.getForObject(url, GameDTO.class);

        if (gameDTO == null) return null; // No game found

        // Converts GameDTO to Game entity
        Game game = new Game();
        game.setId(gameDTO.id());
        game.setTitle(gameDTO.title());
        game.setThumbnail(gameDTO.thumbnail());
        game.setShortDescription(gameDTO.shortDescription());
        game.setGame_url(gameDTO.gameUrl());
        game.setGenre(gameDTO.genre());
        game.setPlatform(gameDTO.platform());
        game.setPublisher(gameDTO.publisher());
        game.setDeveloper(gameDTO.developer());
        game.setRelease_date(gameDTO.releaseDate());
        // Sets rating: uses API rating if present, otherwise generates random
        game.setRating(gameDTO.rating() != null ? gameDTO.rating() : 2.5 + new Random().nextDouble() * 2.5);

        return game;
    }

    // Searches games by title filtering those containing the query (case-insensitive)
    public List<Game> searchGames(String query) {
        List<Game> allGames = getFreeGames(null, null, null); // Retrieves all games
        return allGames.stream()
                .filter(g -> g.getTitle() != null && g.getTitle().toLowerCase().contains(query.toLowerCase()))
                .collect(Collectors.toList());
    }
}
