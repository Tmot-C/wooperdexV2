package wooperdexV2_backend.models;

public class BuiltPokemon {

    private String id;           // Pokemon's identifier (name in lowercase without special characters)
    private int num;             // Dex number
    private String name;
    private String[] types;
    private BaseStats baseStats;
    private String[] abilities;
    private String chosenAbility;
    private String move1;
    private String move2;
    private String move3;
    private String move4;
    private String item;         // Optional; may be null if not provided
    private String nature;
    private BaseStats evs;       // EVs, reusing the BaseStats structure
    private BaseStats ivs;
    
    public BuiltPokemon() {
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
    public String getChosenAbility() {
        return chosenAbility;
    }
    public void setChosenAbility(String chosenAbility) {
        this.chosenAbility = chosenAbility;
    }
    public String getMove1() {
        return move1;
    }
    public void setMove1(String move1) {
        this.move1 = move1;
    }
    public String getMove2() {
        return move2;
    }
    public void setMove2(String move2) {
        this.move2 = move2;
    }
    public String getMove3() {
        return move3;
    }
    public void setMove3(String move3) {
        this.move3 = move3;
    }
    public String getMove4() {
        return move4;
    }
    public void setMove4(String move4) {
        this.move4 = move4;
    }
    public String getItem() {
        return item;
    }
    public void setItem(String item) {
        this.item = item;
    }
    public String getNature() {
        return nature;
    }
    public void setNature(String nature) {
        this.nature = nature;
    }
    public BaseStats getEvs() {
        return evs;
    }
    public void setEvs(BaseStats evs) {
        this.evs = evs;
    }
    public BaseStats getIvs() {
        return ivs;
    }
    public void setIvs(BaseStats ivs) {
        this.ivs = ivs;
    }

    
    
}
