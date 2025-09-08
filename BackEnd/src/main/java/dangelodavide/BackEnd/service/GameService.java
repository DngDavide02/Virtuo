package dangelodavide.BackEnd.service;

import dangelodavide.BackEnd.DTO.GameDTO;
import dangelodavide.BackEnd.entities.Game;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GameService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String BASE_URL = "https://www.freetogame.com/api";
    private final Random random = new Random();

    public List<Game> getFreeGames(String platform, String category, String sortBy) {
        String url = BASE_URL + "/games";
        if (platform != null) url += (url.contains("?") ? "&" : "?") + "platform=" + platform;
        if (category != null) url += (url.contains("?") ? "&" : "?") + "category=" + category;
        if (sortBy != null) url += (url.contains("?") ? "&" : "?") + "sort-by=" + sortBy;

        Game[] games = restTemplate.getForObject(url, Game[].class);

        if (games != null) {
            return Arrays.stream(games)
                    .peek(g -> g.setRating(2.5 + random.nextDouble() * 2.5))
                    .collect(Collectors.toList());
        }
        return List.of();
    }

    public Game getGameDetails(Integer id) {
        String url = BASE_URL + "/game?id=" + id;

        GameDTO gameDTO = restTemplate.getForObject(url, GameDTO.class);

        if (gameDTO == null) return null;

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
        game.setRating(gameDTO.rating() != null ? gameDTO.rating() : 2.5 + new Random().nextDouble() * 2.5);

        return game;
    }




    public List<Game> searchGames(String query) {
        List<Game> allGames = getFreeGames(null, null, null);
        return allGames.stream()
                .filter(g -> g.getTitle() != null && g.getTitle().toLowerCase().contains(query.toLowerCase()))
                .collect(Collectors.toList());
    }
}
