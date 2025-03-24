package wooperdexV2_backend.models;

public class User {

    private String email;
    private String name;
    private String firebaseId;

    public User() {
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
    public String getFirebaseId() {
        return firebaseId;
    }
    public void setFirebaseId(String firebaseId) {
        this.firebaseId = firebaseId;
    }

    
    
}
