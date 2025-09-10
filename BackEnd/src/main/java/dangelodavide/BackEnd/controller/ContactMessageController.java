package dangelodavide.BackEnd.controller;

import dangelodavide.BackEnd.entities.ContactMessage;
import dangelodavide.BackEnd.payload.ContactMessageRequest;
import dangelodavide.BackEnd.services.ContactMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contacts")
public class ContactMessageController {

    @Autowired
    private ContactMessageService service;

    @PostMapping("/send")
    public ResponseEntity<ContactMessage> sendMessage(@RequestBody ContactMessageRequest request) {
        ContactMessage saved = service.saveMessage(request);
        return ResponseEntity.ok(saved);
    }
}
