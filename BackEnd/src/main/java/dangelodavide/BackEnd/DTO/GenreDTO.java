package dangelodavide.BackEnd.DTO;

public record GenreDTO(
        Long id,
        String name,
        String slug,
        Integer games_count,
        String image_background,
        String description
) {}
