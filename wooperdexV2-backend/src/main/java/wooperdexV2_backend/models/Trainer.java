package wooperdexV2_backend.models;

import java.util.Arrays;

public class Trainer {

    private String firebaseId;
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

    

    @Override
    public String toString() {
        return "Trainer [firebaseId=" + firebaseId + ", email=" + email + ", name=" + name + ", teams="
                + Arrays.toString(teams) + "]";
    }

    public String getFirebaseId() {
        return firebaseId;
    }

    public void setFirebaseId(String firebaseId) {
        this.firebaseId = firebaseId;
    }


    
    
}
