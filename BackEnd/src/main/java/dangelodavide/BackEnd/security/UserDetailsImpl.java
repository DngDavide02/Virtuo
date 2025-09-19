package dangelodavide.BackEnd.security;

import dangelodavide.BackEnd.entities.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

// Implementa UserDetails di Spring Security per integrare il nostro User con il sistema di sicurezza
public class UserDetailsImpl implements UserDetails {

    private final Long id; // id dell'utente
    private final String username; // username dell'utente
    private final String password; // password codificata
    private final Collection<? extends GrantedAuthority> authorities; // ruoli/permessi dell'utente

    // Costruttore principale
    public UserDetailsImpl(Long id, String username, String password, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
    }

    // Metodo statico per creare un UserDetailsImpl a partire da un'entità User
    public static UserDetailsImpl build(User user) {
        // Crea la lista di authorities a partire dal ruolo dell'utente (es. ROLE_USER o ROLE_ADMIN)
        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );
        return new UserDetailsImpl(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                authorities
        );
    }

    // Restituisce le authorities (ruoli) dell'utente
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    // Restituisce la password codificata
    @Override
    public String getPassword() {
        return password;
    }

    // Restituisce lo username
    @Override
    public String getUsername() {
        return username;
    }

    // Restituisce true se l'account non è scaduto
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // Restituisce true se l'account non è bloccato
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    // Restituisce true se le credenziali non sono scadute
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // Restituisce true se l'utente è abilitato
    @Override
    public boolean isEnabled() {
        return true;
    }
}
