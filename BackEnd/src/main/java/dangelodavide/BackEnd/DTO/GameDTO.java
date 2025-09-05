package dangelodavide.BackEnd.DTO;

public record GameDTO(
        int id,
        String title,
        String thumbnail,
        String short_description,
        String game_url,
        String genre,
        String platform,
        String publisher,
        String developer,
        String releaseDate,
        Double rating
) {}
