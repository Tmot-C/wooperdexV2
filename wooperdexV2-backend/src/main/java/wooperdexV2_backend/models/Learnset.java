package wooperdexV2_backend.models;

import org.springframework.data.mongodb.core.mapping.Field;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


public class Learnset {


    private String[] moves;

    public Learnset() {
    }


    public String[] getMoves() {
        return moves;
    }
    public void setMoves(String[] moves) {
        this.moves = moves;
    }
    
}
