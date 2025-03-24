package wooperdexV2_backend.models;

import org.springframework.data.mongodb.core.mapping.Field;


public class Ability {

    @Field("id")
    private String id;
    private String name;
    private int rating;
    private int num;
    private String shortDesc;
    public Ability() {
    }
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public int getRating() {
        return rating;
    }
    public void setRating(int rating) {
        this.rating = rating;
    }
    public int getNum() {
        return num;
    }
    public void setNum(int num) {
        this.num = num;
    }
    public String getShortDesc() {
        return shortDesc;
    }
    public void setShortDesc(String shortDesc) {
        this.shortDesc = shortDesc;
    }

    
    
}
