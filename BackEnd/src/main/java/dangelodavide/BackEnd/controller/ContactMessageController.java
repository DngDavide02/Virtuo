package dangelodavide.BackEnd.controller;

import dangelodavide.BackEnd.entities.ContactMessage;
import dangelodavide.BackEnd.payload.ContactMessageRequest;
import dangelodavide.BackEnd.service.ContactMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Indica che questa classe è un controller REST
@RestController
// Tutte le rotte partono da /api/contacts
@RequestMapping("/api/contacts")
public class ContactMessageController {

    // Inietta automaticamente il service che gestisce i messaggi di contatto
    @Autowired
    private ContactMessageService service;

    // Endpoint POST per inviare un nuovo messaggio di contatto
    @PostMapping("/send")
    public ResponseEntity<ContactMessage> sendMessage(@RequestBody ContactMessageRequest request) {
        // Salva il messaggio tramite il service
        ContactMessage saved = service.saveMessage(request);
        // Ritorna il messaggio salvato con status 200 OK
        return ResponseEntity.ok(saved);
    }
}
