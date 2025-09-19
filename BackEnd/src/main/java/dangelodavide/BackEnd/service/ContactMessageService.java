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
    private ContactMessageRepository repository; // Repository per salvare i messaggi nel DB

    // Parametri di configurazione Mailgun
    @Value("${mailgun.domain}")
    private String domain;

    @Value("${mailgun.api-key}")
    private String apiKey;

    @Value("${mailgun.sender}")
    private String sender;

    @Value("${mailgun.recipient}")
    private String recipient;

    private final RestTemplate restTemplate = new RestTemplate(); // Oggetto per inviare richieste HTTP

    // Salva un messaggio di contatto e invia una notifica email
    public ContactMessage saveMessage(ContactMessageRequest request) {
        ContactMessage msg = new ContactMessage();
        msg.setName(request.name());
        msg.setEmail(request.email());
        msg.setMessage(request.message());

        // Salvataggio nel database
        ContactMessage saved = repository.save(msg);

        // Invio notifica email
        sendNotification(saved);

        return saved;
    }

    // Metodo privato per inviare notifica via Mailgun
    private void sendNotification(ContactMessage msg) {
        String url = "https://api.mailgun.net/v3/" + domain + "/messages";

        // Impostazione intestazioni HTTP con autenticazione Basic e tipo contenuto
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth("api", apiKey);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // Corpo della richiesta con i dati dell'email
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("from", sender);
        body.add("to", recipient);
        body.add("subject", "Nuovo messaggio da " + msg.getName());
        body.add("text", "Email: " + msg.getEmail() + "\n\nMessaggio:\n" + msg.getMessage());

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            // Invio richiesta POST a Mailgun
            restTemplate.exchange(url, HttpMethod.POST, request, String.class);
        } catch (Exception e) {
            // Gestione eventuali errori nell'invio dell'email
            System.err.println("Errore invio email tramite Mailgun: " + e.getMessage());
        }
    }

}
