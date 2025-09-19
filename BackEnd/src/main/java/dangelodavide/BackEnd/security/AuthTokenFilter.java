package dangelodavide.BackEnd.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

// Questo filtro viene eseguito una sola volta per ogni richiesta HTTP
@Component
public class AuthTokenFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils; // Utilità per generare e validare JWT
    private final UserDetailsServiceImpl userDetailsService; // Servizio per caricare dati utente

    public AuthTokenFilter(JwtUtils jwtUtils, UserDetailsServiceImpl userDetailsService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    // Metodo principale che intercetta ogni richiesta
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Recupera l'header Authorization dalla richiesta
        String header = request.getHeader("Authorization");
        String token = null;
        String username = null;

        // Controlla che l'header sia presente e inizi con "Bearer "
        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7); // Estrae il token rimuovendo "Bearer "
            try {
                username = jwtUtils.getUsernameFromJwtToken(token); // Estrae username dal JWT
                System.out.println("[DEBUG] JWT username extracted: " + username);
            } catch (Exception e) {
                System.out.println("[DEBUG] Invalid JWT: " + e.getMessage());
            }
        } else {
            System.out.println("[DEBUG] No Authorization header or bad format");
        }

        // Se abbiamo uno username valido e non siamo già autenticati
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                // Carica i dettagli dell'utente dal database
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                System.out.println("[DEBUG] Loaded UserDetails: " + userDetails);

                // Valida il token JWT
                if (jwtUtils.validateJwtToken(token)) {
                    // Crea l'oggetto di autenticazione e lo inserisce nel contesto di sicurezza
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("[DEBUG] Authenticated user: " + username);
                    System.out.println("[DEBUG] Authorities: " + userDetails.getAuthorities());
                } else {
                    System.out.println("[DEBUG] JWT validation failed");
                }
            } catch (Exception e) {
                System.out.println("[DEBUG] UserDetails load failed: " + e.getMessage());
            }
        }

        // Continua la catena di filtri
        filterChain.doFilter(request, response);
    }
}
