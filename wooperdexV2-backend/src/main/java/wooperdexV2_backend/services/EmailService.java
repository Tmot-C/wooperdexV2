package wooperdexV2_backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendConfirmationEmail(String email) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("wooperdexuser@gmail.com"); 
        message.setTo(email);
        message.setSubject("Wooperdex registration");
        message.setText("Thank you for using the Wooperdexv2 teambuilder!" );

        mailSender.send(message);
    }
}
