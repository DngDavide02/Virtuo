package dangelodavide.BackEnd.payload;

public record ContactMessageRequest(
        String name,
        String email,
        String message
) {}
