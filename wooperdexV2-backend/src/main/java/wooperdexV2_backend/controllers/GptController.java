package wooperdexV2_backend.controllers;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import wooperdexV2_backend.models.ChatGptRequest;

@RequestMapping("/api/analysis")
@RestController
public class GptController {

    @Value("${OPENAPIKEY}") 
    private String openAiApiKey;

    @PostMapping("/pokemon-analysis")
    public ResponseEntity<String> getPokemonAnalysis(@PathVariable String pokemon) {
        ChatGptRequest request = new ChatGptRequest(pokemon);
        
        // Use RestTemplate or WebClient to send the request to OpenAI
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(
            "https://api.openai.com/v1/chat/completions", 
            new HttpEntity<>(request, createHeaders()), 
            String.class
        );
        
        return response;
    }


    private HttpHeaders createHeaders() {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + openAiApiKey);
        return headers;
    }
        
}
