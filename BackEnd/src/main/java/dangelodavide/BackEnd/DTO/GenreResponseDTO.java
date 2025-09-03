package dangelodavide.BackEnd.DTO;

import java.util.List;

public record GenreResponseDTO(int count, String next, String previous, List<GenreDTO> results) {}

