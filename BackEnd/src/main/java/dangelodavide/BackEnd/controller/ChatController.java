package dangelodavide.BackEnd.controller;

import dangelodavide.BackEnd.entities.ChatMessage;
import dangelodavide.BackEnd.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Indica che questa classe è un controller REST
@RestController
// Tutte le rotte iniziano con /api/chat
@RequestMapping("/api/chat")
public class ChatController {

    // Service che gestisce la logica delle chat
    private final ChatService chatService;

    // Costruttore con dependency injection
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // Endpoint GET per recuperare tutti i messaggi di chat
    @GetMapping("/messages")
    public ResponseEntity<List<ChatMessage>> getMessages() {
        // Ritorna la lista di messaggi salvati tramite il service
        return ResponseEntity.ok(chatService.getAllMessages());
    }

    // Endpoint POST per inviare un nuovo messaggio
    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessage message) {
        // Salva il messaggio tramite il service e lo ritorna
        return ResponseEntity.ok(chatService.saveMessage(message));
    }
}
