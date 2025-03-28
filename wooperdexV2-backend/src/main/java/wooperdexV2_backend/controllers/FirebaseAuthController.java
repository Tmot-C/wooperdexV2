package wooperdexV2_backend.controllers;

import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.constraints.Email;
import wooperdexV2_backend.models.Trainer;
import wooperdexV2_backend.models.User;
import wooperdexV2_backend.repositories.MongoRepository;
import wooperdexV2_backend.repositories.UserRepository;
import wooperdexV2_backend.services.EmailService;

@RestController
@RequestMapping("/api/users")
public class FirebaseAuthController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private MongoRepository mongoRepo;

    @Autowired
    private EmailService emailService;


    @PostMapping("/firebase-auth")
    public ResponseEntity<?> firebaseAuthentication(@RequestBody Map<String, String> payload) {
        // Extract user data from payload
        String firebaseId = payload.get("firebaseId");
        String email = payload.get("email");
        String name = payload.get("name");

        // Debugging logs
        System.out.println("==== Firebase Auth Request ====");
        System.out.println("firebaseId: " + firebaseId);
        System.out.println("email: " + email);
        System.out.println("name: '" + name + "'");
        System.out.println("name is null: " + (name == null));
        System.out.println("name is empty: " + (name != null && name.isEmpty()));
        System.out.println("===========================");

        
        if (firebaseId == null || email == null) {
            System.out.println("ERROR: Firebase ID or email is missing");
            return ResponseEntity.badRequest().body("Firebase ID and email are required");
        }
        
        //Save if new
        if(!userRepo.exists(firebaseId) || !mongoRepo.exists(firebaseId)){

            User newUser = new User();

            newUser.setId(firebaseId);
            newUser.setEmail(email);
            newUser.setName(name);
            userRepo.save(newUser);
    
            Trainer newTrainer = new Trainer();
            newTrainer.setFirebaseId(firebaseId);
            newTrainer.setEmail(email);
            newTrainer.setName(name);
            mongoRepo.saveTrainer(newTrainer);
            emailService.sendConfirmationEmail(email);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", firebaseId);
        response.put("name", name);
        response.put("email", email);
        
        return ResponseEntity.ok(response);

    }
}
