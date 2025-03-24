package wooperdexV2_backend.models;

public class Trainer {

    private String id;
    private String email;
    private String name;
    private Team[] teams;

    public Trainer() {
    }
    
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Team[] getTeams() {
        return teams;
    }
    public void setTeams(Team[] teams) {
        this.teams = teams;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    
    
}
