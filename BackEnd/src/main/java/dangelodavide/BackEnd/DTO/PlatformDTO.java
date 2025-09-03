package dangelodavide.BackEnd.DTO;

public record PlatformDTO(
        Long id,
        String name,
        String slug,
        Integer games_count,
        String image_background,
        String description,
        String image,
        Integer year_start,
        Integer year_end
) {}
