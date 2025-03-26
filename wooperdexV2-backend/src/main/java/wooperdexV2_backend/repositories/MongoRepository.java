package wooperdexV2_backend.repositories;

import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import wooperdexV2_backend.models.Ability;
import wooperdexV2_backend.models.Item;
import wooperdexV2_backend.models.Learnset;
import wooperdexV2_backend.models.Move;
import wooperdexV2_backend.models.Pokemon;
import wooperdexV2_backend.models.Trainer;

@Repository
public class MongoRepository {

    @Autowired
    MongoTemplate mongoTemplate;

    public List<Pokemon> getAllPokemon() {
        return mongoTemplate.findAll(Pokemon.class, "pokedex");
    }

    public List<Ability> getAllAbilities() {
        return mongoTemplate.findAll(Ability.class, "abilities");
    }

    public List<Move> getAllMoves() {
        return mongoTemplate.findAll(Move.class, "moves");
    }

    public List<Item> getAllItems() {
        return mongoTemplate.findAll(Item.class, "items");
    }

    public Learnset getLearnset(String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(id));
        query.fields().include("moves").exclude("_id");

        Document doc = mongoTemplate.findOne(query, Document.class, "learnsets");
        if (doc != null) {
            Learnset learnset = mongoTemplate.getConverter().read(Learnset.class, doc);
            return learnset;

        } else {
            query = new Query();
            query.addCriteria(Criteria.where("id").is(id));
            query.fields().include("baseSpecies").exclude("_id");
            doc = mongoTemplate.findOne(query, Document.class, "pokedex");
            String baseSpecies = doc.getString("baseSpecies");
            baseSpecies =baseSpecies.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();

            query = new Query();
            query.addCriteria(Criteria.where("id").is(baseSpecies));
            query.fields().include("moves").exclude("_id");
            return mongoTemplate.findOne(query, Learnset.class, "learnsets");

            
        }
    }

    public Trainer getTrainer(String id) {
        System.out.println(id);
        Query query = new Query(Criteria.where("firebaseId").is(id));
        Trainer trainer = mongoTemplate.findOne(query, Trainer.class, "trainers");
        System.out.println(trainer.toString());
        return trainer;
    }

    public void saveTrainer(Trainer trainer) {
        Query query = new Query(Criteria.where("firebaseId").is(trainer.getFirebaseId()));

        Update update = new Update();
        update.set("firebaseId", trainer.getFirebaseId());
        update.set("email", trainer.getEmail());
        update.set("name", trainer.getName());
        update.set("teams", trainer.getTeams());

        mongoTemplate.upsert(query, update, "trainers");
    }
    
    public boolean exists(String id) {
        Query query = new Query(Criteria.where("firebaseId").is(id));
        return mongoTemplate.exists(query, "trainers");
    }
}
