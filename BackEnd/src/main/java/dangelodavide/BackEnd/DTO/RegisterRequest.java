package dangelodavide.BackEnd.DTO;

public record RegisterRequest(
        String username,
        String email,
        String password
) {
}
