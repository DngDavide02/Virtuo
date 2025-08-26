package dangelodavide.BackEnd.DTO;

import java.util.List;

public record GameResponseDTO(
        List<GameDTO> results
) {}
