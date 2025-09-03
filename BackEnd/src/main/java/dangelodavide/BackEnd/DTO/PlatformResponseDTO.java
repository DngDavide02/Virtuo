package dangelodavide.BackEnd.DTO;

import java.util.List;

public record PlatformResponseDTO(int count, String next, String previous, List<PlatformDTO> results) {}
