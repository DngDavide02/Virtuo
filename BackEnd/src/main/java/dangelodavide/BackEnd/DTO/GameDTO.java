package dangelodavide.BackEnd.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public record GameDTO(
        int id,
        String title,
        String thumbnail,
        @JsonProperty("short_description") String shortDescription,
        @JsonProperty("game_url") String gameUrl,
        String genre,
        String platform,
        String publisher,
        String developer,
        @JsonProperty("release_date") String releaseDate,
        Double rating
) {}
