package dangelodavide.BackEnd.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/ai-chat")
public class AiChatController {

    private final Map<String, List<String>> keywordResponses = Map.ofEntries(
            Map.entry("ciao", List.of("Ciao! Come va?", "Ehi, tutto bene?", "Ciao, pronto per giocare un po'?", "Ciao! Ti va di fare due chiacchiere?")),
            Map.entry("ranked", List.of("Hai fatto qualche partita ranked oggi?", "Come sta andando la tua ranked?", "Hai vinto l'ultima partita ranked?", "Ti stai divertendo con le ranked o sono stressanti?")),
            Map.entry("bug", List.of("Hai trovato qualche bug?", "Mi dispiace, i bug sono fastidiosi.", "Sì, a volte il gioco ha qualche problema tecnico.", "Magari gli sviluppatori lo sistemeranno presto.")),
            Map.entry("epico", List.of("Ah sì, quello è stato un momento bello da vedere.", "Sì, molto epico!", "Mi piace quando succedono cose così in game.", "Epico davvero! Ti è piaciuto tanto?")),
            Map.entry("mvp", List.of("Hai fatto un buon lavoro nella partita.", "Complimenti per essere stato il migliore del match.", "Bravo, sei stato MVP!", "Essere MVP è sempre una bella soddisfazione.")),
            Map.entry("help", List.of("Posso aiutarti, cosa succede?", "Fammi sapere dove sei bloccato.", "Certo, cerchiamo di risolvere insieme.", "Ok, dimmi pure di cosa hai bisogno.")),
            Map.entry("boss", List.of("Il boss era difficile?", "Come avete affrontato il boss?", "Serve un po' di strategia per batterlo.", "Hai usato una tattica particolare contro il boss?")),
            Map.entry("gg", List.of("GG!", "Bel game!", "Complimenti per la partita!", "Good game davvero.")),
            Map.entry("team", List.of("Com’era il tuo team?", "Ti sei trovato bene con la squadra?", "Il team ti ha supportato?", "Hai avuto un buon affiatamento con loro?")),
            Map.entry("lose", List.of("Succede di perdere, l’importante è imparare.", "Non ti preoccupare, capita a tutti.", "La prossima andrà meglio.", "Ci sta, nessuno vince sempre.")),
            Map.entry("win", List.of("Grande vittoria!", "Complimenti!", "Ottimo lavoro!", "La vittoria è meritata.")),
            Map.entry("stanco", List.of("Capisco, a volte ci vuole una pausa.", "Riposa un po', ti farà bene.", "Meglio fermarsi se sei stanco.", "Vuoi continuare a parlare lo stesso?")),
            Map.entry("felice", List.of("Mi fa piacere sentirlo!", "Che bello, sono contento per te.", "Ottimo, continuiamo così!", "La felicità è contagiosa.")),
            Map.entry("triste", List.of("Mi dispiace, vuoi parlarne?", "Capisco, a volte ci sono giornate no.", "Ti va di sfogarti un po’?", "Non sei solo, tranquillo."))
    );

    private final Map<String, List<String>> phraseResponses = Map.ofEntries(
            Map.entry("come stai", List.of("Sto bene, grazie. E tu?", "Tutto bene, grazie per chiedere.", "Bene, e tu?")),
            Map.entry("come va", List.of("Va tutto bene, e da te?", "Tutto ok, grazie.", "Va bene, come va a te?")),
            Map.entry("tutto bene", List.of("Sì, tutto bene.", "Tutto a posto.", "Perfetto, grazie.")),
            Map.entry("buongiorno", List.of("Buongiorno! Come va?", "Ciao, buona giornata!", "Buongiorno, tutto bene?")),
            Map.entry("buonanotte", List.of("Buonanotte, dormi bene!", "Riposa e sogna qualcosa di bello.", "Ci sentiamo domani, buonanotte!")),
            Map.entry("che fai", List.of("Sto parlando con te adesso. Tu che fai?", "Niente di speciale, e tu?", "Ti sto ascoltando, dimmi pure.")),
            Map.entry("che ne pensi", List.of("Penso che sia interessante.", "Secondo me non è male.", "Potrebbe funzionare.")),
            Map.entry("mi piace", List.of("Bello sentirlo!", "Ottima scelta!", "Anch’io la penso così.")),
            Map.entry("non mi piace", List.of("Capisco, i gusti sono gusti.", "Ok, ci sta non piaccia a tutti.", "Va bene, ognuno ha le sue preferenze."))
    );

    private final Map<String, List<String>> affirmationResponses = Map.ofEntries(
            Map.entry("sì", List.of("Perfetto!", "Capito.", "Va bene.", "Ok, grazie per la conferma.")),
            Map.entry("si", List.of("Perfetto!", "Capito.", "Va bene.", "Ok, grazie per la conferma.")),
            Map.entry("assolutamente", List.of("Bene, allora procediamo.", "Perfetto, grazie.", "Ok!")),
            Map.entry("ok", List.of("Va bene.", "Ok, capito.", "D'accordo.")),
            Map.entry("certo", List.of("Perfetto.", "Va bene, capito.", "D'accordo!")),
            Map.entry("no", List.of("Va bene, capisco.", "Ok, grazie per avermi detto.", "Capito.")),
            Map.entry("non credo", List.of("Capisco il tuo punto di vista.", "Ok, ci sta.", "D'accordo, grazie per aver condiviso.")),
            Map.entry("forse", List.of("Capisco, non sei sicuro.", "Ok, vediamo meglio.", "Forse è già una risposta.")),
            Map.entry("mah", List.of("Sei indeciso?", "Ok, non sei convinto.", "Va bene, dimmi di più."))
    );

    private final List<String> fallbackResponses = List.of(
            "Ah capisco, continua.",
            "Interessante, raccontami di più.",
            "Non sono sicuro di aver capito bene, puoi spiegare?",
            "Ok, continua pure.",
            "Capisco, continua.",
            "Davvero? Raccontami meglio.",
            "Ah, interessante, dimmi di più.",
            "Capito. Vuoi approfondire?",
            "Mi incuriosisce quello che dici.",
            "Ok, e poi cosa è successo?"
    );

    private final Random random = new Random();
    private final Map<String, List<String>> sessionContext = new HashMap<>();

    @PostMapping("/send")
    public Map<String, Object> sendMessage(@RequestParam String sessionId, @RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message").toLowerCase();

        sessionContext.putIfAbsent(sessionId, new ArrayList<>());
        sessionContext.get(sessionId).add("User: " + userMessage);

        List<String> responses = new ArrayList<>();

        for (String phrase : phraseResponses.keySet()) {
            if (userMessage.contains(phrase)) {
                List<String> possible = phraseResponses.get(phrase);
                responses.add(possible.get(random.nextInt(possible.size())));
            }
        }

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

        String aiResponse = responses.isEmpty() ? fallbackResponses.get(random.nextInt(fallbackResponses.size()))
                : String.join(" ", responses);

        sessionContext.get(sessionId).add("AI: " + aiResponse);

        return Map.of(
                "response", aiResponse,
                "context", sessionContext.get(sessionId)
        );
    }
}
