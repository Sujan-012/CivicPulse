package com.civicpulse.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.civicpulse.backend.entity.Role;
import com.civicpulse.backend.entity.User;
import com.civicpulse.backend.repository.UserRepository;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInitializer(UserRepository userRepository,
                            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (!userRepository.existsByEmail("admin@civicpulse.com")) {

            User admin = new User();

            admin.setName("Abdul Admin");
            admin.setEmail("admin@civicpulse.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);

            userRepository.save(admin);

            System.out.println("==================================");
            System.out.println("Admin account created successfully");
            System.out.println("Email    : admin@civicpulse.com");
            System.out.println("Password : admin123");
            System.out.println("==================================");
        }

        if (!userRepository.existsByEmail("officer@civicpulse.com")) {

            User officer = new User();

            officer.setName("Default Officer");
            officer.setEmail("officer@civicpulse.com");
            officer.setPassword(passwordEncoder.encode("officer123"));
            officer.setRole(Role.OFFICER);

            userRepository.save(officer);

            System.out.println("==================================");
            System.out.println("Officer account created successfully");
            System.out.println("Email    : officer@civicpulse.com");
            System.out.println("Password : officer123");
            System.out.println("==================================");
        }
    }
}