package dangelodavide.BackEnd.service;

import dangelodavide.BackEnd.entities.Game;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for game-related operations.
 * Delegates to GameApiService for external API calls.
 */
@Service
public class GameService {

    private final com.virtuo.service.GameApiService gameApiService;

    public GameService(com.virtuo.service.GameApiService gameApiService) {
        this.gameApiService = gameApiService;
    }

    /**
     * Retrieves list of free games with optional filters.
     * @param platform Platform filter
     * @param category Category filter  
     * @param sortBy Sort order
     * @return List of games
     */
    public List<Game> getFreeGames(String platform, String category, String sortBy) {
        return gameApiService.getFreeGames(platform, category, sortBy);
    }

    /**
     * Retrieves details of a single game.
     * @param id Game ID
     * @return Game details
     */
    public Game getGameDetails(Integer id) {
        return gameApiService.getGameDetails(id);
    }

    /**
     * Searches games by title.
     * @param query Search query
     * @return List of matching games
     */
    public List<Game> searchGames(String query) {
        return gameApiService.searchGames(query);
    }
}
