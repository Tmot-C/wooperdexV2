package wooperdexV2_backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import wooperdexV2_backend.services.JsonService;

@SpringBootApplication
public class WooperdexV2BackendApplication {

	@Autowired
	private JsonService jsonService;

	public static void main(String[] args) {
		SpringApplication.run(WooperdexV2BackendApplication.class, args);
	}



}
