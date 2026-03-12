package dangelodavide.BackEnd.security;

import dangelodavide.BackEnd.entities.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

// Implements Spring Security UserDetails to integrate our User with the security system
public class UserDetailsImpl implements UserDetails {

    private final Long id; // user id
    private final String username; // user username
    private final String password; // encoded password
    private final Collection<? extends GrantedAuthority> authorities; // user roles/permissions

    // Main constructor
    public UserDetailsImpl(Long id, String username, String password, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
    }

    // Static method to create UserDetailsImpl from a User entity
    public static UserDetailsImpl build(User user) {
        // Creates authorities list from user role (e.g., ROLE_USER or ROLE_ADMIN)
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

    // Returns user authorities (roles)
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    // Returns encoded password
    @Override
    public String getPassword() {
        return password;
    }

    // Returns username
    @Override
    public String getUsername() {
        return username;
    }

    // Returns true if account is not expired
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // Returns true if account is not locked
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    // Returns true if credentials are not expired
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // Returns true if user is enabled
    @Override
    public boolean isEnabled() {
        return true;
    }
}
