package dangelodavide.BackEnd.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long localId;

    private Integer id;
    private String title;
    private String thumbnail;
    private String short_description;
    private String game_url;
    private String genre;
    private String platform;
    private String publisher;
    private String developer;
    private String release_date;

    private Double rating; // campo aggiunto per compatibilità col front end

    public Game() {}

    // Getter e Setter
    public Long getLocalId() { return localId; }
    public void setLocalId(Long localId) { this.localId = localId; }
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getThumbnail() { return thumbnail; }
    public void setThumbnail(String thumbnail) { this.thumbnail = thumbnail; }
    public String getShort_description() { return short_description; }
    public void setShort_description(String short_description) { this.short_description = short_description; }
    public String getGame_url() { return game_url; }
    public void setGame_url(String game_url) { this.game_url = game_url; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }
    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }
    public String getDeveloper() { return developer; }
    public void setDeveloper(String developer) { this.developer = developer; }
    public String getRelease_date() { return release_date; }
    public void setRelease_date(String release_date) { this.release_date = release_date; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
}
