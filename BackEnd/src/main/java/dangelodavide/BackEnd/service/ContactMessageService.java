package dangelodavide.BackEnd.services;

import dangelodavide.BackEnd.entities.ContactMessage;
import dangelodavide.BackEnd.payload.ContactMessageRequest;
import dangelodavide.BackEnd.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class ContactMessageService {

    @Autowired
    private ContactMessageRepository repository;

    @Value("${mailgun.domain}")
    private String domain;

    @Value("${mailgun.api-key}")
    private String apiKey;

    @Value("${mailgun.sender}")
    private String sender;

    @Value("${mailgun.recipient}")
    private String recipient;

    private final RestTemplate restTemplate = new RestTemplate();

    public ContactMessage saveMessage(ContactMessageRequest request) {
        ContactMessage msg = new ContactMessage();
        msg.setName(request.name());
        msg.setEmail(request.email());
        msg.setMessage(request.message());
        ContactMessage saved = repository.save(msg);

        sendNotification(saved);

        return saved;
    }

    private void sendNotification(ContactMessage msg) {
        String url = "https://api.mailgun.net/v3/" + domain + "/messages";

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth("api", apiKey);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        Map<String, String> body = new LinkedHashMap<>();
        body.put("from", sender);
        body.put("to", recipient);
        body.put("subject", "Nuovo messaggio da " + msg.getName());
        body.put("text", "Email: " + msg.getEmail() + "\n\nMessaggio:\n" + msg.getMessage());

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
            System.out.println("Mailgun response status: " + response.getStatusCode());
            System.out.println("Mailgun response body: " + response.getBody());
        } catch (Exception e) {
            System.err.println("Errore invio email tramite Mailgun: " + e.getMessage());
        }
    }

}
