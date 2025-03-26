package wooperdexV2_backend.services;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.exc.StreamReadException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class JsonService {
    //Remnant file from when wrangling pokemon data
    public void readJson(){
        try {
            // Create ObjectMapper instance
            ObjectMapper mapper = new ObjectMapper();
            
            // Read the JSON file into a JsonNode
            JsonNode rootNode = mapper.readTree(new File(""));
            
            // Create an empty array node to hold our results
            ArrayNode pokemonArray = mapper.createArrayNode();
            
            // Iterate through all fields of the root object
            Iterator<Entry<String, JsonNode>> fields = rootNode.fields();
            while (fields.hasNext()) {
                Entry<String, JsonNode> entry = fields.next();
                String key = entry.getKey();
                JsonNode pokemonNode = entry.getValue();
                
                // Create a new object with id as the first field
                ObjectNode newPokemonNode = mapper.createObjectNode();
                newPokemonNode.put("id", key);
                
                // Copy all fields from the original node to the new node
                pokemonNode.fields().forEachRemaining(field -> {
                    newPokemonNode.set(field.getKey(), field.getValue());
                });
                
                // Add the modified pokemon object to our array
                pokemonArray.add(newPokemonNode);
            }
            
            // Write the array to a new JSON file
            mapper.writerWithDefaultPrettyPrinter()
                  .writeValue(new File("items_array.json"), pokemonArray);
            
            System.out.println("Conversion completed successfully!");
            
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public void mergeItems() throws StreamReadException, DatabindException, IOException{
        ObjectMapper mapper = new ObjectMapper();
        
        // 1. Read the JSON files
        List<Map<String, Object>> itemsData = mapper.readValue(
            new File("C:\\Users\\tim\\Documents\\wooperdexV2\\wooperdexV2-backend\\src\\main\\resources\\static\\items_array.json"),
            new TypeReference<List<Map<String,Object>>>() {}
        );
        
        Map<String, List<String>> categorizedData = mapper.readValue(
            new File("C:\\Users\\tim\\Documents\\wooperdexV2\\categorized-items.json"),
            new TypeReference<Map<String, List<String>>>() {}
        );
        
        // 2. For each item, find the category
        for (Map<String, Object> item : itemsData) {
            String itemId = (String) item.get("id");
            String foundCategory = null;

            // Loop over every category key
            for (Map.Entry<String, List<String>> entry : categorizedData.entrySet()) {
                if (entry.getValue().contains(itemId)) {
                    foundCategory = entry.getKey();
                    break;
                }
            }

            // 3. Add (or update) the category field
            item.put("category", foundCategory);
        }

        // 4. Write the updated list back out if desired
        mapper.writerWithDefaultPrettyPrinter()
              .writeValue(new File("items_with_categories.json"), itemsData);
        
        System.out.println("Merged JSON written to items_with_categories.json");
    }
    
    

    
}
