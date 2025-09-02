package dangelodavide.BackEnd.service;

import dangelodavide.BackEnd.DTO.GameDTO;
import dangelodavide.BackEnd.DTO.GameResponseDTO;
import dangelodavide.BackEnd.entities.Game;
import dangelodavide.BackEnd.repository.GameRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import reactor.netty.http.client.HttpClient;

import java.util.List;

@Service
public class GameService {

    private final GameRepository gameRepository;
    private final WebClient webClient;

    @Value("${rawg.api-key}")
    private String apiKey;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;

        int size = 16 * 1024 * 1024;
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(size))
                .build();

        HttpClient httpClient = HttpClient.create().compress(true);

        this.webClient = WebClient.builder()
                .baseUrl("https://api.rawg.io/api")
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .exchangeStrategies(strategies)
                .build();
    }

    // --- CRUD DB ---
    public Game addGame(Game game) { return gameRepository.save(game); }
    public Game editGame(Long id, Game updated) {
        Game game = gameRepository.findById(id).orElseThrow(() -> new RuntimeException("Game not found"));
        game.setName(updated.getName());
        game.setDescription(updated.getDescription());
        game.setReleased(updated.getReleased());
        game.setBackgroundImage(updated.getBackgroundImage());
        game.setRating(updated.getRating());
        return gameRepository.save(game);
    }
    public void deleteGame(Long id) { gameRepository.deleteById(id); }
    public Game getGame(Long id) { return gameRepository.findById(id).orElseThrow(() -> new RuntimeException("Game not found")); }
    public List<Game> getAllGames() { return gameRepository.findAll(); }

    // --- API RAWG ---
    public List<GameDTO> getGamesFromApi(int page, int pageSize) {
        GameResponseDTO response = webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/games")
                        .queryParam("key", apiKey)
                        .queryParam("page", page)
                        .queryParam("page_size", pageSize)
                        .build())
                .retrieve()
                .bodyToMono(GameResponseDTO.class)
                .block();
        return response != null ? response.results() : List.of();
    }

    public GameDTO getGameFromApi(String id) {
        return webClient.get()
                .uri("/games/{id}?key={apiKey}", id, apiKey)
                .retrieve()
                .bodyToMono(GameDTO.class)
                .block();
    }

    public List<GameDTO> getGamesFromApi(int page, int pageSize, String ordering, String dates) {
        GameResponseDTO response = webClient.get()
                .uri(uriBuilder -> {
                    uriBuilder.path("/games")
                            .queryParam("key", apiKey)
                            .queryParam("page", page)
                            .queryParam("page_size", pageSize);
                    if (ordering != null) uriBuilder.queryParam("ordering", ordering);
                    if (dates != null) uriBuilder.queryParam("dates", dates);
                    return uriBuilder.build();
                })
                .retrieve()
                .bodyToMono(GameResponseDTO.class)
                .block();
        return response != null ? response.results() : List.of();
    }

    // --- Nuovi metodi helper per Top Rated e Coming Soon più attesi ---
    public List<GameDTO> getTopRatedPopular(int page, int pageSize) {
        // Range di Metacritic: solo giochi con punteggio da 80 a 100
        String metacriticRange = "80,100";

        GameResponseDTO response = webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/games")
                        .queryParam("key", apiKey)
                        .queryParam("page", page)
                        .queryParam("page_size", pageSize)
                        .queryParam("ordering", "-metacritic")
                        .queryParam("metacritic", metacriticRange)
                        .build())
                .retrieve()
                .bodyToMono(GameResponseDTO.class)
                .block();

        if (response == null) return List.of();

        // Filtra solo i giochi con immagine disponibile
        return response.results().stream()
                .filter(game -> game.backgroundImage() != null && !game.backgroundImage().isEmpty())
                .toList();
    }


    public List<GameDTO> getComingSoonPopular(int page, int pageSize) {
        String today = java.time.LocalDate.now().toString();
        String nextSixMonths = java.time.LocalDate.now().plusMonths(6).toString();
        // Ordinamento per aggiunte/popolarità per i giochi in uscita
        return getGamesFromApi(page, pageSize, "-added", today + "," + nextSixMonths);
    }

    public List<GameDTO> getFeaturedGames(int page, int pageSize) {
        String twoMonthsAgo = java.time.LocalDate.now().minusMonths(2).toString();
        String today = java.time.LocalDate.now().toString();

        return getGamesFromApi(page, pageSize, "-rating_top", twoMonthsAgo + "," + today)
                .stream()
                .filter(game -> game.backgroundImage() != null && !game.backgroundImage().isEmpty())
                .toList();
    }

    public List<GameDTO> getGamesFromApi(int page, int pageSize, String search) {
        GameResponseDTO response = webClient.get()
                .uri(uriBuilder -> {
                    uriBuilder.path("/games")
                            .queryParam("key", apiKey)
                            .queryParam("page", page)
                            .queryParam("page_size", pageSize);
                    if (search != null && !search.isEmpty()) {
                        uriBuilder.queryParam("search", search);
                    }
                    return uriBuilder.build();
                })
                .retrieve()
                .bodyToMono(GameResponseDTO.class)
                .block();
        return response != null ? response.results() : List.of();
    }


}
