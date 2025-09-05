package dangelodavide.BackEnd.service;

import dangelodavide.BackEnd.DTO.*;
import dangelodavide.BackEnd.entities.Game;
import dangelodavide.BackEnd.repository.GameRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import reactor.netty.http.client.HttpClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;

@Service
public class GameService {

    private final GameRepository gameRepository;
    private final WebClient rawgClient;
    private final WebClient freeToGameClient;

    @Value("${rawg.api-key}")
    private String apiKey;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;

        int size = 16 * 1024 * 1024;
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(size))
                .build();

        HttpClient httpClient = HttpClient.create().compress(true);

        this.rawgClient = WebClient.builder()
                .baseUrl("https://api.rawg.io/api")
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .exchangeStrategies(strategies)
                .build();

        this.freeToGameClient = WebClient.builder()
                .baseUrl("https://www.freetogame.com/api")
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .exchangeStrategies(strategies)
                .build();
    }

    // --- CRUD DB ---
    public Game addGame(Game game) {
        if (gameRepository.existsById(game.getId())) {
            Game existing = gameRepository.findById(game.getId()).orElseThrow();
            existing.setName(game.getName());
            existing.setDescription(game.getDescription());
            existing.setReleased(game.getReleased());
            existing.setBackgroundImage(game.getBackgroundImage());
            existing.setRating(game.getRating());
            return gameRepository.save(existing);
        } else {
            return gameRepository.save(game);
        }
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

    // --- API RAWG con fallback FreeToGame e caching ---
    @Cacheable(value = "gamesCache", key = "'game_' + #id")
    public GameDTO getGameFromApi(String id) {
        GameDTO gameDTO = null;
        try {
            gameDTO = rawgClient.get()
                    .uri("/games/{id}?key={apiKey}", id, apiKey)
                    .retrieve()
                    .bodyToMono(GameDTO.class)
                    .block();
        } catch (WebClientResponseException e) {
            gameDTO = freeToGameClient.get()
                    .uri("/game?id={id}", id)
                    .retrieve()
                    .bodyToMono(GameDTO.class)
                    .block();
        }
        if (gameDTO != null) saveGameIfNotExists(gameDTO);
        return gameDTO;
    }

    @Cacheable(value = "gamesCache", key = "'games_page_' + #page + '_size_' + #pageSize")
    public List<GameDTO> getGamesFromApi(int page, int pageSize) {
        return getGamesFromApiInternal(page, pageSize, null, null);
    }

    @Cacheable(value = "gamesCache", key = "'games_search_' + #page + '_size_' + #pageSize + '_search_' + #search")
    public List<GameDTO> getGamesFromApi(int page, int pageSize, String search) {
        return getGamesFromApiInternal(page, pageSize, null, null, search);
    }

    @Cacheable(value = "gamesCache", key = "'games_filters_' + #page + '_size_' + #pageSize + '_search_' + #search + '_genres_' + #genres + '_platforms_' + #platforms + '_year_' + #year + '_ordering_' + #ordering")
    public List<GameDTO> getGamesWithFilters(int page, int pageSize, String search, String genres, String platforms, Integer year, String ordering) {
        return getGamesFromApiInternal(page, pageSize, ordering, null, search, genres, platforms, year);
    }

    @Cacheable(value = "gamesCache", key = "'games_topRated_' + #page + '_size_' + #pageSize")
    public List<GameDTO> getTopRatedPopular(int page, int pageSize) {
        return getGamesFromApiInternal(page, pageSize, "-metacritic", null);
    }

    @Cacheable(value = "gamesCache", key = "'games_comingSoon_' + #page + '_size_' + #pageSize")
    public List<GameDTO> getComingSoonPopular(int page, int pageSize) {
        String today = java.time.LocalDate.now().toString();
        String nextSixMonths = java.time.LocalDate.now().plusMonths(6).toString();
        return getGamesFromApiInternal(page, pageSize, "-added", today + "," + nextSixMonths);
    }

    @Cacheable(value = "gamesCache", key = "'games_featured_' + #page + '_size_' + #pageSize")
    public List<GameDTO> getFeaturedGames(int page, int pageSize) {
        String twoMonthsAgo = java.time.LocalDate.now().minusMonths(2).toString();
        String today = java.time.LocalDate.now().toString();
        return getGamesFromApiInternal(page, pageSize, "-rating_top", twoMonthsAgo + "," + today)
                .stream()
                .filter(game -> game.backgroundImage() != null && !game.backgroundImage().isEmpty())
                .toList();
    }

    @Cacheable(value = "gamesCache", key = "'genres_page_' + #page + '_size_' + #pageSize + '_ordering_' + #ordering")
    public List<GenreDTO> getGenres(int page, int pageSize, String ordering) {
        String finalOrdering = ordering != null ? ordering : "";
        return rawgClient.get()
                .uri(uriBuilder -> uriBuilder.path("/genres")
                        .queryParam("key", apiKey)
                        .queryParam("page", page)
                        .queryParam("page_size", pageSize)
                        .queryParamIfPresent("ordering", finalOrdering.isEmpty() ? java.util.Optional.empty() : java.util.Optional.of(finalOrdering))
                        .build())
                .retrieve()
                .bodyToMono(GenreResponseDTO.class)
                .block()
                .results();
    }

    @Cacheable(value = "gamesCache", key = "'platforms_page_' + #page + '_size_' + #pageSize + '_ordering_' + #ordering")
    public List<PlatformDTO> getPlatforms(int page, int pageSize, String ordering) {
        String finalOrdering = ordering != null ? ordering : "";
        return rawgClient.get()
                .uri(uriBuilder -> uriBuilder.path("/platforms")
                        .queryParam("key", apiKey)
                        .queryParam("page", page)
                        .queryParam("page_size", pageSize)
                        .queryParamIfPresent("ordering", finalOrdering.isEmpty() ? java.util.Optional.empty() : java.util.Optional.of(finalOrdering))
                        .build())
                .retrieve()
                .bodyToMono(PlatformResponseDTO.class)
                .block()
                .results();
    }

    // --- Helper privati per chiamate RAWG con fallback e salvataggio DB ---
    private List<GameDTO> getGamesFromApiInternal(int page, int pageSize, String ordering, String dates) {
        return getGamesFromApiInternal(page, pageSize, ordering, dates, null, null, null, null);
    }

    private List<GameDTO> getGamesFromApiInternal(int page, int pageSize, String ordering, String dates, String search) {
        return getGamesFromApiInternal(page, pageSize, ordering, dates, search, null, null, null);
    }

    private List<GameDTO> getGamesFromApiInternal(int page, int pageSize, String ordering, String dates, String search, String genres, String platforms, Integer year) {
        List<GameDTO> list;
        try {
            GameResponseDTO response = rawgClient.get()
                    .uri(uriBuilder -> {
                        uriBuilder.path("/games")
                                .queryParam("key", apiKey)
                                .queryParam("page", page)
                                .queryParam("page_size", pageSize);
                        if (ordering != null) uriBuilder.queryParam("ordering", ordering);
                        if (dates != null) uriBuilder.queryParam("dates", dates);
                        if (search != null && !search.isEmpty()) uriBuilder.queryParam("search", search);
                        if (genres != null && !genres.isEmpty()) uriBuilder.queryParam("genres", genres);
                        if (platforms != null && !platforms.isEmpty()) uriBuilder.queryParam("platforms", platforms);
                        if (year != null) uriBuilder.queryParam("dates", year + "-01-01," + year + "-12-31");
                        return uriBuilder.build();
                    })
                    .retrieve()
                    .bodyToMono(GameResponseDTO.class)
                    .blockOptional()
                    .orElse(new GameResponseDTO(List.of()));
            list = response.results();
        } catch (WebClientResponseException e) {
            list = freeToGameClient.get()
                    .uri("/games")
                    .retrieve()
                    .bodyToMono(List.class)
                    .block();
        }
        list.forEach(this::saveGameIfNotExists);
        return list;
    }

    private void saveGameIfNotExists(GameDTO dto) {
        Game game = gameRepository.findById(dto.id()).orElse(null);
        if (game == null) {
            game = new Game();
            game.setId(dto.id());
        }
        game.setName(dto.name());
        game.setDescription(dto.description());
        game.setReleased(dto.released());
        game.setBackgroundImage(dto.backgroundImage());
        game.setRating(dto.rating());
        gameRepository.save(game);
    }

    public void populateGamesFromRawg(int page, int pageSize) {
        List<GameDTO> games = getGamesFromApiInternal(page, pageSize, null, null);

        for (GameDTO dto : games) {
            try {
                GameDTO detailed = getGameFromApi(String.valueOf(dto.id())); // <-- qui
                saveGameIfNotExists(detailed);
            } catch (Exception e) {
                System.err.println("Failed to fetch details for game ID: " + dto.id() + " - " + e.getMessage());
            }
        }
    }


}
