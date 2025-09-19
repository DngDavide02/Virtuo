package dangelodavide.BackEnd.service;

import dangelodavide.BackEnd.DTO.GameDTO;
import dangelodavide.BackEnd.entities.Game;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GameService {

    private final RestTemplate restTemplate = new RestTemplate(); // Per effettuare richieste HTTP
    private final String BASE_URL = "https://www.freetogame.com/api"; // URL base dell'API free-to-game
    private final Random random = new Random(); // Per generare rating casuali

    // Recupera lista di giochi gratuiti dall'API con filtri opzionali: platform, category e sortBy
    public List<Game> getFreeGames(String platform, String category, String sortBy) {
        String url = BASE_URL + "/games";
        if (platform != null) url += (url.contains("?") ? "&" : "?") + "platform=" + platform;
        if (category != null) url += (url.contains("?") ? "&" : "?") + "category=" + category;
        if (sortBy != null) url += (url.contains("?") ? "&" : "?") + "sort-by=" + sortBy;

        // Chiamata GET all'API esterna e mappatura in array di Game
        Game[] games = restTemplate.getForObject(url, Game[].class);

        if (games != null) {
            // Aggiunge un rating casuale tra 2.5 e 5 per ogni gioco
            return Arrays.stream(games)
                    .peek(g -> g.setRating(2.5 + random.nextDouble() * 2.5))
                    .collect(Collectors.toList());
        }
        return List.of(); // Ritorna lista vuota se nessun gioco trovato
    }

    // Recupera i dettagli di un singolo gioco dall'API
    public Game getGameDetails(Integer id) {
        String url = BASE_URL + "/game?id=" + id;

        // Chiamata GET per ottenere un GameDTO
        GameDTO gameDTO = restTemplate.getForObject(url, GameDTO.class);

        if (gameDTO == null) return null; // Nessun gioco trovato

        // Converte GameDTO in Game entity
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
        // Imposta rating: usa quello dell'API se presente, altrimenti genera casuale
        game.setRating(gameDTO.rating() != null ? gameDTO.rating() : 2.5 + new Random().nextDouble() * 2.5);

        return game;
    }

    // Ricerca giochi per titolo filtrando quelli che contengono la query (case-insensitive)
    public List<Game> searchGames(String query) {
        List<Game> allGames = getFreeGames(null, null, null); // Recupera tutti i giochi
        return allGames.stream()
                .filter(g -> g.getTitle() != null && g.getTitle().toLowerCase().contains(query.toLowerCase()))
                .collect(Collectors.toList());
    }
}
