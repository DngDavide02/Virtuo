package dangelodavide.BackEnd.service;

import dangelodavide.BackEnd.DTO.GameDTO;
import dangelodavide.BackEnd.entities.Game;
import dangelodavide.BackEnd.repository.GameRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
public class GameService {

    private final GameRepository gameRepository;
    private final WebClient webClient = WebClient.create("https://api.rawg.io/api");

    @Value("${rawg.api-key}")
    private String apiKey;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    // --- CRUD DB ---
    public Game addGame(Game game) {
        return gameRepository.save(game);
    }

    public Game editGame(Long id, Game updated) {
        Game game = gameRepository.findById(id).orElseThrow(() -> new RuntimeException("Game not found"));
        game.setName(updated.getName());
        game.setDescription(updated.getDescription());
        game.setReleased(updated.getReleased());
        game.setBackgroundImage(updated.getBackgroundImage());
        game.setRating(updated.getRating());
        return gameRepository.save(game);
    }

    public void deleteGame(Long id) {
        gameRepository.deleteById(id);
    }

    public Game getGame(Long id) {
        return gameRepository.findById(id).orElseThrow(() -> new RuntimeException("Game not found"));
    }

    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    // --- API RAWG ---
    public List<GameDTO> getGamesFromApi(int page, int pageSize) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/games")
                        .queryParam("key", apiKey)
                        .queryParam("page", page)
                        .queryParam("page_size", pageSize)
                        .build())
                .retrieve()
                .bodyToFlux(GameDTO.class)
                .collectList()
                .block();
    }
}
