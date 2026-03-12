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

// Indicates that this class is a REST controller
@RestController
// All routes start with /api/auth
@RequestMapping("/api/auth")
public class AuthController {

    // Spring Security AuthenticationManager for handling authentication
    private final AuthenticationManager authenticationManager;
    // Repository for database user operations
    private final UserRepository userRepository;
    // Encoder for encrypting passwords
    private final PasswordEncoder passwordEncoder;
    // Utility for generating JWT tokens
    private final JwtUtils jwtUtils;

    // Constructor with dependency injection
    public AuthController(AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    // POST endpoint for registering a new user
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest request) {
        // Check if username is already taken
        if (userRepository.existsByUsername(request.username())) {
            return ResponseEntity.badRequest().body("Username is already taken!");
        }
        // Check if email is already registered
        if (userRepository.existsByEmail(request.email())) {
            return ResponseEntity.badRequest().body("Email is already registered!");
        }

        Role role = Role.USER; // default role for new user
        // Create new user with encrypted password
        User user = new User(request.username(), request.email(), passwordEncoder.encode(request.password()), role);
        userRepository.save(user); // save user to database
        return ResponseEntity.ok("User registered successfully!"); // return success message
    }

    // POST endpoint for login and JWT generation
    @PostMapping("/login")
    public LoginResponse authenticateUser(@RequestBody LoginRequest request) {
        // Authenticate user with username and password
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        // Get authenticated user details
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        // Generate JWT token for user
        String jwt = jwtUtils.generateJwtToken(userDetails.getUsername());

        // Retrieve User entity from database
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Return user information + JWT token
        return new LoginResponse(
                user.getId(),
                userDetails.getUsername(),
                user.getRole().name(),
                jwt
        );
    }

}
