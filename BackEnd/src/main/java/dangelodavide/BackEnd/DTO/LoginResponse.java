package dangelodavide.BackEnd.DTO;

public record LoginResponse(
        Long id,
        String username,
        String role,
        String token
) {}
