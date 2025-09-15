package dangelodavide.BackEnd.service;

import dangelodavide.BackEnd.DTO.GameDTO;
import dangelodavide.BackEnd.entities.Game;
import dangelodavide.BackEnd.entities.Library;
import dangelodavide.BackEnd.entities.User;
import dangelodavide.BackEnd.repository.GameRepository;
import dangelodavide.BackEnd.repository.LibraryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LibraryService {

    private final GameRepository gameRepository;
    private final LibraryRepository libraryRepository;

    public LibraryService(GameRepository gameRepository, LibraryRepository libraryRepository) {
        this.gameRepository = gameRepository;
        this.libraryRepository = libraryRepository;
    }

    @Transactional
    public void addGameToLibrary(User user, GameDTO gameDTO) {
        Game game = gameRepository.findById((long) gameDTO.id()).orElse(null);

        if (game == null) {
            game = new Game();
            game.setId(gameDTO.id());
            game.setTitle(gameDTO.title());
            game.setShortDescription(gameDTO.shortDescription());
            game.setThumbnail(gameDTO.thumbnail());
            game.setGame_url(gameDTO.gameUrl());
            game.setGenre(gameDTO.genre() != null ? gameDTO.genre() : "Unknown");
            game.setPlatform(gameDTO.platform() != null ? gameDTO.platform() : "Unknown");
            game.setPublisher(gameDTO.publisher() != null ? gameDTO.publisher() : "Unknown");
            game.setDeveloper(gameDTO.developer() != null ? gameDTO.developer() : "Unknown");
            game.setRelease_date(gameDTO.releaseDate() != null ? gameDTO.releaseDate() : "Unknown");
            game.setRating(gameDTO.rating() != null ? gameDTO.rating() : 0.0);

            game = gameRepository.save(game);
        }

        Library library = libraryRepository.findByUser(user).orElseGet(() -> {
            Library newLib = new Library(user);
            return libraryRepository.save(newLib);
        });

        if (!library.getGames().contains(game)) {
            library.addGame(game);
        }
    }
}
