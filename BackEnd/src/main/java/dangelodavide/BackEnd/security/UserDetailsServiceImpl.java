package dangelodavide.BackEnd.security;

import dangelodavide.BackEnd.entities.User;
import dangelodavide.BackEnd.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service // Segnala a Spring che questa è una classe di servizio gestita come bean
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository; // repository per accedere ai dati degli utenti

    // Costruttore con dependency injection della repository
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Metodo richiesto da UserDetailsService per caricare l'utente da username
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Cerca l'utente in DB, se non trovato lancia eccezione UsernameNotFoundException
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        // Converte l'entità User in UserDetailsImpl utilizzabile da Spring Security
        return UserDetailsImpl.build(user);
    }

    // Metodo aggiuntivo per ottenere direttamente l'entità User dal DB
    public User loadUserEntityByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
}
