package dangelodavide.BackEnd.DTO;

public record GameDTO(
        Long id,
        String name,
        String description,
        String released,
        String background_image,
        Double rating
) {
}
