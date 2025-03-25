package wooperdexV2_backend.models;

public class Team {
    private String teamName;
    private BuiltPokemon[] team;

    public Team() {
    }

    public BuiltPokemon[] getTeam() {
        return team;
    }

    public void setTeam(BuiltPokemon[] team) {
        this.team = team;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    
    
}
