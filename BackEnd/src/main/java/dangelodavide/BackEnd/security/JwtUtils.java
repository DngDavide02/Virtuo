package dangelodavide.BackEnd.security;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Date;

// Component for handling JWT token creation and validation
@Component
public class JwtUtils {

    // Secret key defined in application.properties
    @Value("${jwt.secret}")
    private String jwtSecret;

    // Token duration: 24 hours in milliseconds
    private final long jwtExpirationMs = 24 * 60 * 60 * 1000;

    // Generates JWT token from username
    public String generateJwtToken(String username) {
        return Jwts.builder()
                .setSubject(username) // sets username as token subject
                .setIssuedAt(new Date()) // token creation date
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs)) // expiration
                .signWith(SignatureAlgorithm.HS512, jwtSecret) // signs token with HS512 and secret key
                .compact(); // compact to string
    }

    // Extracts username from JWT token
    public String getUsernameFromJwtToken(String token) {
        return Jwts.parser()
                .setSigningKey(jwtSecret) // uses secret key to decode
                .parseClaimsJws(token) // parse token
                .getBody() // gets token body (claims)
                .getSubject(); // returns username
    }

    // Validates JWT token
    public boolean validateJwtToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(jwtSecret) // secret key to verify signature
                    .parseClaimsJws(token); // attempts to parse
            return true; // if no exceptions, token is valid
        } catch (JwtException | IllegalArgumentException e) {
            System.out.println("[DEBUG] JWT validation error: " + e.getMessage()); // error log
            return false; // invalid token
        }
    }
}
