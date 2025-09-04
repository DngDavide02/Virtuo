package dangelodavide.BackEnd.service;

import dangelodavide.BackEnd.entities.Game;
import dangelodavide.BackEnd.entities.Library;
import dangelodavide.BackEnd.entities.User;
import dangelodavide.BackEnd.repository.LibraryRepository;
import dangelodavide.BackEnd.repository.GameRepository;
import dangelodavide.BackEnd.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LibraryService {

    private final LibraryRepository libraryRepository;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;

    public LibraryService(LibraryRepository libraryRepository, UserRepository userRepository, GameRepository gameRepository) {
        this.libraryRepository = libraryRepository;
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
    }

    public Library getOrCreateLibrary(User user) {
        return libraryRepository.findByUser(user).orElseGet(() -> {
            Library lib = new Library(user);
            return libraryRepository.save(lib);
        });
    }

    public void addGameToLibrary(Long userId, Long gameId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Game game = gameRepository.findById(gameId)
                .orElseGet(() -> {
                    Game newGame = new Game();
                    newGame.setName("Unknown"); // o altri dati minimi
                    return gameRepository.save(newGame);
                });

        Library library = getOrCreateLibrary(user);
        library.addGame(game);
        libraryRepository.save(library);
    }



    public void removeGameFromLibrary(Long userId, Long gameId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new RuntimeException("Game not found"));
        Library library = getOrCreateLibrary(user);
        library.removeGame(game);
        libraryRepository.save(library);
    }

    public List<Game> getLibraryGames(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Library library = getOrCreateLibrary(user);
        return List.copyOf(library.getGames());
    }
}
