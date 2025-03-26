package wooperdexV2_backend.models;

import org.springframework.data.mongodb.core.mapping.Field;


public class Item {
    @Field("id")
    private String id;
    private String name;
    private int num;
    private String shortDesc;
    private String category;
    private String[] itemUser;

    public Item() {
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
    public String getShortDesc() {
        return shortDesc;
    }
    public void setShortDesc(String shortDesc) {
        this.shortDesc = shortDesc;
    }
    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }
    public String[] getItemUser() {
        return itemUser;
    }
    public void setItemUser(String[] itemUser) {
        this.itemUser = itemUser;
    }

    


}
