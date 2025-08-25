package dangelodavide.BackEnd.services;

import dangelodavide.BackEnd.DTO.GameDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.List;

@Service
public class GameService {

    private final WebClient webClient = WebClient.create("https://api.rawg.io/api");

    @Value("${rawg.api-key}")
    private String apiKey;

    public List<GameDTO> getGames(int page, int pageSize) {
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
