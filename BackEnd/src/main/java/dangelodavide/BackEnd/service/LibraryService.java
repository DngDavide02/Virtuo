package dangelodavide.BackEnd.service;

import dangelodavide.BackEnd.entities.Game;
import dangelodavide.BackEnd.entities.Library;
import dangelodavide.BackEnd.entities.User;
import dangelodavide.BackEnd.repository.GameRepository;
import dangelodavide.BackEnd.repository.LibraryRepository;
import dangelodavide.BackEnd.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class LibraryService {

    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final LibraryRepository libraryRepository;

    public LibraryService(UserRepository userRepository, GameRepository gameRepository, LibraryRepository libraryRepository) {
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
        this.libraryRepository = libraryRepository;
    }

    private Library getOrCreateLibrary(User user) {
        return libraryRepository.findByUser(user)
                .orElseGet(() -> {
                    Library newLibrary = new Library();
                    newLibrary.setUser(user);
                    return libraryRepository.save(newLibrary);
                });
    }

    public void addGameToLibrary(Long userId, Long gameId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Game game = gameRepository.findById(gameId)
                .orElseGet(() -> {
                    Game newGame = new Game();
                    newGame.setId(gameId);
                    newGame.setName("Unknown");
                    return gameRepository.save(newGame);
                });
        Library library = getOrCreateLibrary(user);
        library.addGame(game);
        libraryRepository.save(library);
    }

    public void removeGameFromLibrary(Long userId, Long gameId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Library library = getOrCreateLibrary(user);
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new RuntimeException("Game not found"));
        library.removeGame(game);
        libraryRepository.save(library);
    }

    public Set<Game> getLibrary(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return getOrCreateLibrary(user).getGames();
    }
}
