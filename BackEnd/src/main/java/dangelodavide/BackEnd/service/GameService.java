package dangelodavide.BackEnd.service;

import dangelodavide.BackEnd.entities.Game;
import dangelodavide.BackEnd.repository.GameRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class GameService {

    private final GameRepository gameRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final String FREETO_API = "https://www.freetogame.com/api/games";

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    public Optional<Game> getGameById(Long id) {
        return gameRepository.findById(id);
    }

    public List<Game> getFreeGames() {
        Game[] games = restTemplate.getForObject(FREETO_API, Game[].class);
        return games != null ? Arrays.asList(games) : List.of();
    }
}
