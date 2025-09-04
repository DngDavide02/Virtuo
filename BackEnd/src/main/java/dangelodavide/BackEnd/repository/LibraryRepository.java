package dangelodavide.BackEnd.repository;

import dangelodavide.BackEnd.entities.Library;
import dangelodavide.BackEnd.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LibraryRepository extends JpaRepository<Library, Long> {
    Optional<Library> findByUser(User user);
}
