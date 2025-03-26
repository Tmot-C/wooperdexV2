package wooperdexV2_backend.models;

import java.util.Collections;
import java.util.List;

public class ChatGptRequest {
    private String model;
    private List<Message> messages;
    private double temperature;

    private String gptRequestTemplate = """
            Tell me how %s is built competitively. Do so in a similar manner to how the rotomdex would, but try to not be too overly wordy.
            Do not talk mention Terastallization, as that is not allowed in the current format.
            """;

    // Nested Message class
    public static class Message {
        private String role;
        private String content;

        // Constructors
        public Message() {}
        
        public Message(String role, String content) {
            this.role = role;
            this.content = content;
        }

        // Getters and setters
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    // Constructors
    public ChatGptRequest() {}

    public ChatGptRequest(String pokemon) {
        this.model = "gpt-4o";
        this.messages = Collections.singletonList(
            new Message("user", 
                String.format(gptRequestTemplate, 
                pokemon)
            )
        );
        this.temperature = 0.7;
    }

    // Getters and setters
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    public List<Message> getMessages() { return messages; }
    public void setMessages(List<Message> messages) { this.messages = messages; }
    public double getTemperature() { return temperature; }
    public void setTemperature(double temperature) { this.temperature = temperature; }
}