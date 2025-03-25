package wooperdexV2_backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import wooperdexV2_backend.models.Ability;
import wooperdexV2_backend.models.Item;
import wooperdexV2_backend.models.Learnset;
import wooperdexV2_backend.models.Move;
import wooperdexV2_backend.models.Pokemon;
import wooperdexV2_backend.models.Trainer;
import wooperdexV2_backend.repositories.MongoRepository;

@Service
public class GetterService {

    @Autowired
    private MongoRepository mongoRepository;

    public List<Pokemon> getAllPokemon() {
        List<Pokemon> pokedex = mongoRepository.getAllPokemon();
        //get rid of null tier values
        for (Pokemon pokemon : pokedex) {
            if (pokemon.getTier() == null) {
                pokemon.setTier("Illegal");
            }
        }
        return pokedex;
    }

    public List<Ability> getAllAbilities() {
        return mongoRepository.getAllAbilities();
    }

    public List<Move> getAllMoves() {
        return mongoRepository.getAllMoves();
    }

    public List<Item> getAllItems() {
        return mongoRepository.getAllItems();
    }
    
    public Learnset getLearnset(String id) {
        return mongoRepository.getLearnset(id);
    }

    public Trainer getTrainer(String id) {
        return mongoRepository.getTrainer(id);
    }

    public void saveTrainer(Trainer trainer) {
        mongoRepository.saveTrainer(trainer);
    }
}
