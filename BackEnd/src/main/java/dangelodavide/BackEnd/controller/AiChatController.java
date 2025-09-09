package dangelodavide.BackEnd.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/ai-chat")
public class AiChatController {

    private final Map<String, List<String>> keywordResponses = Map.of(
            "ciao", List.of("Ciao! Come va?", "Ehi, tutto bene?", "Ciao, pronto per giocare un po'?"),
            "ranked", List.of("Hai fatto qualche partita ranked oggi?", "Come sta andando la tua ranked?", "Hai vinto l'ultima partita ranked?"),
            "bug", List.of("Hai trovato qualche bug?", "Mi dispiace, i bug sono fastidiosi.", "Sì, a volte il gioco ha qualche problema tecnico."),
            "epico", List.of("Ah sì, quello è stato un momento bello da vedere.", "Sì, molto epico!", "Mi piace quando succedono cose così in game."),
            "mvp", List.of("Hai fatto un buon lavoro nella partita.", "Complimenti per essere stato il migliore del match.", "Bravo, sei stato MVP!"),
            "help", List.of("Posso aiutarti, cosa succede?", "Fammi sapere dove sei bloccato.", "Certo, cerchiamo di risolvere insieme."),
            "boss", List.of("Il boss era difficile?", "Come avete affrontato il boss?", "Serve un po' di strategia per batterlo.")
    );

    private final Map<String, List<String>> phraseResponses = Map.of(
            "come stai", List.of("Sto bene, grazie. E tu?", "Tutto bene, grazie per chiedere.", "Bene, e tu?"),
            "come va", List.of("Va tutto bene, e da te?", "Tutto ok, grazie.", "Va bene, come va a te?"),
            "tutto bene", List.of("Sì, tutto bene.", "Tutto a posto.", "Perfetto, grazie."),
            "buongiorno", List.of("Buongiorno! Come va?", "Ciao, buona giornata!", "Buongiorno, tutto bene?")
    );

    private final Map<String, List<String>> affirmationResponses = Map.of(
            "sì", List.of("Perfetto!", "Capito.", "Va bene.", "Ok, grazie per la conferma."),
            "si", List.of("Perfetto!", "Capito.", "Va bene.", "Ok, grazie per la conferma."),
            "assolutamente", List.of("Bene, allora procediamo.", "Perfetto, grazie.", "Ok!"),
            "ok", List.of("Va bene.", "Ok, capito.", "D'accordo."),
            "certo", List.of("Perfetto.", "Va bene, capito.", "D'accordo!"),
            "no", List.of("Va bene, capisco.", "Ok, grazie per avermi detto.", "Capito."),
            "non credo", List.of("Capisco il tuo punto di vista.", "Ok, ci sta.", "D'accordo, grazie per aver condiviso.")
    );

    private final List<String> fallbackResponses = List.of(
            "Ah capisco, continua.",
            "Interessante, raccontami di più.",
            "Non sono sicuro di aver capito bene, puoi spiegare?",
            "Ok, continua pure.",
            "Capisco, continua."
    );

    private final Random random = new Random();
    private final Map<String, List<String>> sessionContext = new HashMap<>();

    @PostMapping("/send")
    public Map<String, Object> sendMessage(@RequestParam String sessionId, @RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message").toLowerCase();

        sessionContext.putIfAbsent(sessionId, new ArrayList<>());
        sessionContext.get(sessionId).add("User: " + userMessage);

        List<String> responses = new ArrayList<>();

        // Cerca frasi comuni
        for (String phrase : phraseResponses.keySet()) {
            if (userMessage.contains(phrase)) {
                List<String> possible = phraseResponses.get(phrase);
                responses.add(possible.get(random.nextInt(possible.size())));
            }
        }

        // Cerca parole chiave singole
        for (String word : userMessage.split(" ")) {
            if (keywordResponses.containsKey(word)) {
                List<String> possible = keywordResponses.get(word);
                responses.add(possible.get(random.nextInt(possible.size())));
            }
            if (affirmationResponses.containsKey(word)) {
                List<String> possible = affirmationResponses.get(word);
                responses.add(possible.get(random.nextInt(possible.size())));
            }
        }

        // Se non ci sono risposte specifiche, usa fallback
        String aiResponse = responses.isEmpty() ? fallbackResponses.get(random.nextInt(fallbackResponses.size()))
                : String.join(" ", responses);

        sessionContext.get(sessionId).add("AI: " + aiResponse);

        return Map.of(
                "response", aiResponse,
                "context", sessionContext.get(sessionId)
        );
    }
}
