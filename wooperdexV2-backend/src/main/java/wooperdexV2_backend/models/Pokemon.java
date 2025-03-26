package wooperdexV2_backend.models;

import org.springframework.data.mongodb.core.mapping.Field;




public class Pokemon {

    @Field("id")
    private String id;
    private int num;
    private String name;
    private String[] types;
    private BaseStats baseStats;
    private String[] abilities;
    private String tier;
    public Pokemon() {
    }
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public int getNum() {
        return num;
    }
    public void setNum(int num) {
        this.num = num;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String[] getTypes() {
        return types;
    }
    public void setTypes(String[] types) {
        this.types = types;
    }
    public BaseStats getBaseStats() {
        return baseStats;
    }
    public void setBaseStats(BaseStats baseStats) {
        this.baseStats = baseStats;
    }
    public String[] getAbilities() {
        return abilities;
    }
    public void setAbilities(String[] abilities) {
        this.abilities = abilities;
    }
    public String getTier() {
        return tier;
    }
    public void setTier(String tier) {
        this.tier = tier;
    }

    


    
}
