package wooperdexV2_backend.models;

import org.springframework.data.mongodb.core.mapping.Field;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


public class Move {
    
    @Field("id")
    private String id;
    private String name;
    private int num;
    private String type;
    private String category;
    private int basePower;
    private String accuracy;    
    private int pp;
    private String shortDesc;

    public Move() {
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
    public int getNum() {
        return num;
    }
    public void setNum(int num) {
        this.num = num;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }
    public int getBasePower() {
        return basePower;
    }
    public void setBasePower(int basePower) {
        this.basePower = basePower;
    }
    public String getAccuracy() {
        return accuracy;
    }
    public void setAccuracy(String accuracy) {
        this.accuracy = accuracy;
    }
    public int getPp() {
        return pp;
    }
    public void setPp(int pp) {
        this.pp = pp;
    }
    public String getShortDesc() {
        return shortDesc;
    }
    public void setShortDesc(String shortDesc) {
        this.shortDesc = shortDesc;
    }
    
    
}
