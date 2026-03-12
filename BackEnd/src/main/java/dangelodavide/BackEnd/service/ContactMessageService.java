package dangelodavide.BackEnd.service;

import dangelodavide.BackEnd.entities.ContactMessage;
import dangelodavide.BackEnd.payload.ContactMessageRequest;
import dangelodavide.BackEnd.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@Service
public class ContactMessageService {

    @Autowired
    private ContactMessageRepository repository; // Repository for saving messages to database

    // Mailgun configuration parameters
    @Value("${mailgun.domain}")
    private String domain;

    @Value("${mailgun.api-key}")
    private String apiKey;

    @Value("${mailgun.sender}")
    private String sender;

    @Value("${mailgun.recipient}")
    private String recipient;

    private final RestTemplate restTemplate = new RestTemplate(); // Object for sending HTTP requests

    // Saves a contact message and sends email notification
    public ContactMessage saveMessage(ContactMessageRequest request) {
        ContactMessage msg = new ContactMessage();
        msg.setName(request.name());
        msg.setEmail(request.email());
        msg.setMessage(request.message());

        // Save to database
        ContactMessage saved = repository.save(msg);

        // Send email notification
        sendNotification(saved);

        return saved;
    }

    // Private method for sending notification via Mailgun
    private void sendNotification(ContactMessage msg) {
        String url = "https://api.mailgun.net/v3/" + domain + "/messages";

        // Set HTTP headers with Basic authentication and content type
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth("api", apiKey);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // Request body with email data
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("from", sender);
        body.add("to", recipient);
        body.add("subject", "New message from " + msg.getName());
        body.add("text", "Email: " + msg.getEmail() + "\n\nMessage:\n" + msg.getMessage());

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            // Send POST request to Mailgun
            restTemplate.exchange(url, HttpMethod.POST, request, String.class);
        } catch (Exception e) {
            // Handle any errors in email sending
            System.err.println("Error sending email via Mailgun: " + e.getMessage());
        }
    }

}
