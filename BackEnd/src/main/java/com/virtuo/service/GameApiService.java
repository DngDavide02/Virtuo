package com.virtuo.service;

import dangelodavide.BackEnd.DTO.GameDTO;
import dangelodavide.BackEnd.entities.Game;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Service for handling external game API operations.
 */
@Service
public class GameApiService {
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final String BASE_URL = "https://www.freetogame.com/api";
    private final Random random = new Random();
    
    /**
     * Retrieves list of free games from API with optional filters.
     * @param platform Platform filter
     * @param category Category filter
     * @param sortBy Sort order
     * @return List of games with random ratings
     */
    public List<Game> getFreeGames(String platform, String category, String sortBy) {
        String url = buildGamesUrl(platform, category, sortBy);
        
        Game[] games = restTemplate.getForObject(url, Game[].class);
        
        if (games != null) {
            return Arrays.stream(games)
                    .peek(g -> g.setRating(2.5 + random.nextDouble() * 2.5))
                    .toList();
        }
        return Collections.emptyList();
    }
    
    /**
     * Retrieves details of a single game from API.
     * @param id Game ID
     * @return Game details or null if not found
     */
    public Game getGameDetails(Integer id) {
        String url = BASE_URL + "/game?id=" + id;
        
        GameDTO gameDTO = restTemplate.getForObject(url, GameDTO.class);
        
        if (gameDTO == null) {
            return null;
        }
        
        return convertToGame(gameDTO);
    }
    
    /**
     * Searches games by title.
     * @param query Search query
     * @return List of matching games
     */
    public List<Game> searchGames(String query) {
        List<Game> allGames = getFreeGames(null, null, null);
        
        return allGames.stream()
                .filter(g -> g.getTitle() != null && 
                        g.getTitle().toLowerCase().contains(query.toLowerCase()))
                .toList();
    }
    
    private String buildGamesUrl(String platform, String category, String sortBy) {
        String url = BASE_URL + "/games";
        
        if (platform != null) {
            url += (url.contains("?") ? "&" : "?") + "platform=" + platform;
        }
        if (category != null) {
            url += (url.contains("?") ? "&" : "?") + "category=" + category;
        }
        if (sortBy != null) {
            url += (url.contains("?") ? "&" : "?") + "sort-by=" + sortBy;
        }
        
        return url;
    }
    
    private Game convertToGame(GameDTO dto) {
        Game game = new Game();
        game.setId(dto.id());
        game.setTitle(dto.title());
        game.setThumbnail(dto.thumbnail());
        game.setShortDescription(dto.shortDescription());
        game.setGame_url(dto.gameUrl());
        game.setGenre(dto.genre() != null ? dto.genre() : "Unknown");
        game.setPlatform(dto.platform() != null ? dto.platform() : "Unknown");
        game.setPublisher(dto.publisher() != null ? dto.publisher() : "Unknown");
        game.setDeveloper(dto.developer() != null ? dto.developer() : "Unknown");
        game.setRelease_date(dto.releaseDate() != null ? dto.releaseDate() : "Unknown");
        game.setRating(dto.rating() != null ? dto.rating() : 2.5 + new Random().nextDouble() * 2.5);
        
        return game;
    }
}
