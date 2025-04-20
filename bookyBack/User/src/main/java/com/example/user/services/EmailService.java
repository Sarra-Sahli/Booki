package com.example.user.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.base-url}")
    private String baseUrl;

    /**
     * Send a welcome email to a newly registered user
     * 
     * @param to recipient email address
     * @param username username of the recipient
     */
    @Async
    public void sendWelcomeEmail(String to, String username) {
        try {
            logger.info("Preparing to send welcome email to {}", to);
            
            // Create a Thymeleaf context
            Context context = new Context();
            context.setVariable("username", username);
            context.setVariable("baseUrl", baseUrl);
            
            // Process the HTML template with Thymeleaf
            String htmlContent = templateEngine.process("welcome-email", context);
            
            // Create the email message
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Welcome to Booky!");
            helper.setText(htmlContent, true); // true indicates HTML content
            
            // Send the email
            mailSender.send(message);
            logger.info("Welcome email sent successfully to {}", to);
            
        } catch (MessagingException e) {
            logger.error("Failed to send welcome email to {}: {}", to, e.getMessage());
        }
    }
    
    /**
     * Send a verification email to confirm user's email address
     * 
     * @param to recipient email address
     * @param username username of the recipient
     * @param verificationToken token for email verification
     */
    @Async
    public void sendVerificationEmail(String to, String username, String verificationToken) {
        try {
            logger.info("Preparing to send verification email to {}", to);
            
            // Create a Thymeleaf context
            Context context = new Context();
            context.setVariable("username", username);
            context.setVariable("verificationLink", baseUrl + "/verify?token=" + verificationToken);
            context.setVariable("baseUrl", baseUrl);
            
            // Process the HTML template with Thymeleaf
            String htmlContent = templateEngine.process("verification-email", context);
            
            // Create the email message
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Verify Your Email Address");
            helper.setText(htmlContent, true); // true indicates HTML content
            
            // Send the email
            mailSender.send(message);
            logger.info("Verification email sent successfully to {}", to);
            
        } catch (MessagingException e) {
            logger.error("Failed to send verification email to {}: {}", to, e.getMessage());
        }
    }
}
