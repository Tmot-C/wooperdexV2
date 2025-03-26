package wooperdexV2_backend.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import wooperdexV2_backend.models.ChatGptRequest;

@RequestMapping("/api/analysis")
@RestController
public class GptController {

    @Value("${OPENAPIKEY}")
    private String openAiApiKey;

    @PostMapping("/{pokemon}")
    public ResponseEntity<String> getPokemonAnalysis(@PathVariable String pokemon) {
        System.out.println("GPT request made for: " + pokemon);
        ChatGptRequest request = new ChatGptRequest(pokemon);

        // Use RestTemplate or WebClient to send the request to OpenAI
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(
                "https://api.openai.com/v1/chat/completions",
                new HttpEntity<>(request, createHeaders()),
                String.class);

        // Parse the response and extract just the content
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response.getBody());
            String content = rootNode.path("choices").path(0).path("message").path("content").asText();
            return ResponseEntity.ok(content);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing response: " + e.getMessage());
        }
    }

    private HttpHeaders createHeaders() {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + openAiApiKey);
        return headers;
    }

}
