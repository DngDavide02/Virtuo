package dangelodavide.BackEnd.repository;

import dangelodavide.BackEnd.entities.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {}
