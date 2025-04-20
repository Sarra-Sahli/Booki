package Reviews.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class BadWordApiService {

    private static final String BAD_WORD_API_URL = "https://www.purgomalum.com/service/containsprofanity?text=";

    private final RestTemplate restTemplate;

    public BadWordApiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Utilisation de l'API externe pour vérifier les bad words
    public boolean checkProfanity(String text) {
        String url = UriComponentsBuilder.fromHttpUrl(BAD_WORD_API_URL)
                .queryParam("text", text)
                .toUriString();
        return restTemplate.getForObject(url, Boolean.class);
    }
}
