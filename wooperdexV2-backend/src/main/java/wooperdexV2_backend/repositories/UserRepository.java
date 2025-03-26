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
        INSERT INTO users (id, email, name)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          email = VALUES(email)
    """;

    final String SQL_EXISTS_USER = "SELECT EXISTS(SELECT 1 FROM users WHERE id = ?)";

    public void save(User user){
        jdbcTemplate.update(SQL_UPSERT_USER, user.getId(), user.getEmail(), user.getName());
    }
    
    public boolean exists(String id){
        return jdbcTemplate.queryForObject(SQL_EXISTS_USER, Boolean.class, id);
    }
}
