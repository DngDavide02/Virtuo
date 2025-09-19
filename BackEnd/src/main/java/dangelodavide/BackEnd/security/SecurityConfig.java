package dangelodavide.BackEnd.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

// Configurazione principale di Spring Security
@Configuration
@EnableMethodSecurity // abilita la sicurezza a livello di metodi (@PreAuthorize, @Secured)
public class SecurityConfig {

    private final AuthTokenFilter authTokenFilter; // filtro personalizzato per JWT

    public SecurityConfig(AuthTokenFilter authTokenFilter) {
        this.authTokenFilter = authTokenFilter;
    }

    // Configura il filtro di sicurezza principale
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors() // abilita CORS
                .and()
                .csrf(csrf -> csrf.disable()) // disabilita CSRF perché si usa JWT e non sessione
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // endpoint di login/register liberi
                        .requestMatchers("/api/games/**").permitAll() // endpoint giochi liberi
                        .requestMatchers("/api/ai-chat/**").permitAll() // chatbot libero
                        .requestMatchers("/api/contacts/send").permitAll() // contatti liberi
                        .requestMatchers("/api/admin/**").hasRole("ADMIN") // solo admin
                        .requestMatchers("/api/library/**").permitAll() // libreria accessibile
                        .anyRequest().authenticated() // tutti gli altri endpoint richiedono autenticazione
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)); // nessuna sessione, JWT stateless

        // Aggiunge il filtro JWT prima del filtro standard di autenticazione
        http.addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Configurazione CORS per permettere richieste dal frontend
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); // origine frontend
        configuration.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS")); // metodi permessi
        configuration.setAllowedHeaders(List.of("*")); // headers permessi
        configuration.setAllowCredentials(true); // permette cookie/autorizzazioni

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // applica a tutte le rotte
        return source;
    }

    // Bean per codificare le password con BCrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Bean per fornire AuthenticationManager, necessario per login
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
