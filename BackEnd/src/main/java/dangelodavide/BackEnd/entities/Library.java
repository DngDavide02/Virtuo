package dangelodavide.BackEnd.entities;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "libraries")
public class Library {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @ManyToMany
    @JoinTable(
            name = "library_games",
            joinColumns = @JoinColumn(name = "library_id"),
            inverseJoinColumns = @JoinColumn(name = "game_id")
    )
    private Set<Game> games = new HashSet<>();

    public Library() {}

    public Library(User user) {
        this.user = user;
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public Set<Game> getGames() { return games; }

    public void addGame(Game game) { games.add(game); }
    public void removeGame(Game game) { games.remove(game); }
}
