package dangelodavide.BackEnd.service;

import dangelodavide.BackEnd.DTO.GameDTO;
import dangelodavide.BackEnd.entities.Game;
import dangelodavide.BackEnd.entities.Library;
import dangelodavide.BackEnd.entities.User;
import dangelodavide.BackEnd.repository.GameRepository;
import dangelodavide.BackEnd.repository.LibraryRepository;
import dangelodavide.BackEnd.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LibraryService {

    private final GameRepository gameRepository;
    private final LibraryRepository libraryRepository;
    private final UserRepository userRepository;

    public LibraryService(GameRepository gameRepository, LibraryRepository libraryRepository, UserRepository userRepository) {
        this.gameRepository = gameRepository;
        this.libraryRepository = libraryRepository;
        this.userRepository = userRepository;
    }

    // Aggiunge un gioco alla libreria di un utente, creando il gioco se non esiste già nel DB
    @Transactional
    public void addGameToLibrary(User user, GameDTO gameDTO) {
        // Controllo se il gioco esiste nel DB
        Game game = gameRepository.findById((long) gameDTO.id()).orElse(null);

        if (game == null) {
            // Creazione nuova entità Game dal DTO
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

        // Recupera la libreria dell'utente o ne crea una nuova
        Library library = libraryRepository.findByUser(user).orElseGet(() -> {
            Library newLib = new Library(user);
            return libraryRepository.save(newLib);
        });

        // Controllo duplicati usando l'id del gioco
        boolean alreadyInLibrary = library.getGames()
                .stream()
                .anyMatch(g -> g.getId().equals(gameDTO.id()));

        if (alreadyInLibrary) {
            throw new RuntimeException("Game already in library");
        }

        // Aggiunge il gioco e salva la libreria
        library.addGame(game);
        libraryRepository.save(library);
    }

    // Restituisce la lista dei giochi presenti nella libreria di un utente come DTO
    public List<GameDTO> getLibraryGamesByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Library library = libraryRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Library not found"));

        return library.getGames()
                .stream()
                .map(game -> new GameDTO(
                        game.getId(),
                        game.getTitle(),
                        game.getThumbnail(),
                        game.getShortDescription(),
                        game.getGame_url(),
                        game.getGenre(),
                        game.getPlatform(),
                        game.getPublisher(),
                        game.getDeveloper(),
                        game.getRelease_date(),
                        game.getRating()
                ))
                .toList();
    }

    // Rimuove un gioco dalla libreria dell'utente
    @Transactional
    public void removeGameFromLibrary(User user, Integer externalGameId) {
        Library library = libraryRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Library not found"));

        // Trova il gioco nella libreria usando l'id esterno
        Game gameToRemove = library.getGames()
                .stream()
                .filter(g -> g.getId().equals(externalGameId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Game not found in user library"));

        // Rimuove il gioco e salva la libreria
        library.removeGame(gameToRemove);
        libraryRepository.save(library);
    }
}
