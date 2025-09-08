package dangelodavide.BackEnd.service;

import dangelodavide.BackEnd.entities.ChatMessage;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ChatService {

    private final List<ChatMessage> messages = new ArrayList<>();

    public List<ChatMessage> getAllMessages() {
        return messages;
    }

    public ChatMessage saveMessage(ChatMessage message) {
        message.setTimestamp(LocalDateTime.now());
        messages.add(message);
        return message;
    }
}
