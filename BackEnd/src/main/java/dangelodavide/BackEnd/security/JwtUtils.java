package dangelodavide.BackEnd.security;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Date;

// Componente per gestire la creazione e validazione dei token JWT
@Component
public class JwtUtils {

    // Chiave segreta definita nel file application.properties
    @Value("${jwt.secret}")
    private String jwtSecret;

    // Durata del token: 24 ore in millisecondi
    private final long jwtExpirationMs = 24 * 60 * 60 * 1000;

    // Genera un token JWT a partire dallo username
    public String generateJwtToken(String username) {
        return Jwts.builder()
                .setSubject(username) // imposta lo username come soggetto del token
                .setIssuedAt(new Date()) // data di creazione del token
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs)) // scadenza
                .signWith(SignatureAlgorithm.HS512, jwtSecret) // firma il token con HS512 e la chiave segreta
                .compact(); // compattalo in stringa
    }

    // Estrae lo username dal token JWT
    public String getUsernameFromJwtToken(String token) {
        return Jwts.parser()
                .setSigningKey(jwtSecret) // usa la chiave segreta per decodificare
                .parseClaimsJws(token) // parse del token
                .getBody() // ottiene il corpo del token (claims)
                .getSubject(); // ritorna lo username
    }

    // Valida il token JWT
    public boolean validateJwtToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(jwtSecret) // chiave segreta per verificare firma
                    .parseClaimsJws(token); // tenta di fare il parse
            return true; // se non ci sono eccezioni, il token è valido
        } catch (JwtException | IllegalArgumentException e) {
            System.out.println("[DEBUG] JWT validation error: " + e.getMessage()); // log errore
            return false; // token non valido
        }
    }
}
