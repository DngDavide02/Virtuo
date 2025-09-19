package dangelodavide.BackEnd.controller;

import dangelodavide.BackEnd.DTO.LoginResponse;
import dangelodavide.BackEnd.entities.Role;
import dangelodavide.BackEnd.entities.User;
import dangelodavide.BackEnd.DTO.JwtResponse;
import dangelodavide.BackEnd.DTO.LoginRequest;
import dangelodavide.BackEnd.DTO.RegisterRequest;
import dangelodavide.BackEnd.repository.UserRepository;
import dangelodavide.BackEnd.security.JwtUtils;
import dangelodavide.BackEnd.security.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

// Indica che questa classe è un controller REST
@RestController
// Tutte le rotte iniziano con /api/auth
@RequestMapping("/api/auth")
public class AuthController {

    // Spring Security AuthenticationManager per gestire l'autenticazione
    private final AuthenticationManager authenticationManager;
    // Repository per operazioni sul database utenti
    private final UserRepository userRepository;
    // Encoder per cifrare le password
    private final PasswordEncoder passwordEncoder;
    // Utility per generare token JWT
    private final JwtUtils jwtUtils;

    // Costruttore con dependency injection
    public AuthController(AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    // Endpoint POST per registrare un nuovo utente
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest request) {
        // Controlla se lo username è già preso
        if (userRepository.existsByUsername(request.username())) {
            return ResponseEntity.badRequest().body("Username is already taken!");
        }
        // Controlla se l'email è già registrata
        if (userRepository.existsByEmail(request.email())) {
            return ResponseEntity.badRequest().body("Email is already registered!");
        }

        Role role = Role.USER; // ruolo di default per il nuovo utente
        // Crea nuovo utente cifrando la password
        User user = new User(request.username(), request.email(), passwordEncoder.encode(request.password()), role);
        userRepository.save(user); // salva l'utente nel DB
        return ResponseEntity.ok("User registered successfully!"); // ritorna messaggio di successo
    }

    // Endpoint POST per login e generazione JWT
    @PostMapping("/login")
    public LoginResponse authenticateUser(@RequestBody LoginRequest request) {
        // Autentica l'utente con username e password
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        // Ottiene i dettagli dell'utente autenticato
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        // Genera un token JWT per l'utente
        String jwt = jwtUtils.generateJwtToken(userDetails.getUsername());

        // Recupera l'entità User dal DB
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Restituisce informazioni utente + token JWT
        return new LoginResponse(
                user.getId(),
                userDetails.getUsername(),
                user.getRole().name(),
                jwt
        );
    }

}
