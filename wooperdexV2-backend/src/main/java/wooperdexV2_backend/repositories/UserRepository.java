package wooperdexV2_backend.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import wooperdexV2_backend.models.User;

@Repository
public class UserRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    final String SQL_UPSERT_USER = """
        INSERT INTO users (email, name, firebaseId)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          name = VALUES(name),
          firebaseId = VALUES(firebaseId)
    """;

    public void save(User user){
        jdbcTemplate.update(SQL_UPSERT_USER, user.getEmail(), user.getName(), user.getFirebaseId());
    }
    
}
