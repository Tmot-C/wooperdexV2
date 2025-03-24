package wooperdexV2_backend.controllers;

import org.springframework.web.bind.annotation.RestController;

import wooperdexV2_backend.models.Ability;
import wooperdexV2_backend.models.Item;
import wooperdexV2_backend.models.Learnset;
import wooperdexV2_backend.models.Move;
import wooperdexV2_backend.models.Pokemon;
import wooperdexV2_backend.services.GetterService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/api")
public class WooperdexController {

    @Autowired
    private GetterService getSvc;

    @GetMapping("/pokedex")
    public List<Pokemon> getPokemon() {
        System.out.println("success");
        return getSvc.getAllPokemon();

    }
    
    @GetMapping("/abilities")
    public List<Ability> getAbilities() {
        return getSvc.getAllAbilities();
    }

    @GetMapping("/moves")
    public List<Move> getMoves() {
        return getSvc.getAllMoves();
    }

    @GetMapping("/items")
    public List<Item> getItems() {
        return getSvc.getAllItems();
    }

    @GetMapping("/learnset/{id}")
    public Learnset getLearnsetById(@PathVariable String id) {
        return getSvc.getLearnset(id);
    }
    
    
}
