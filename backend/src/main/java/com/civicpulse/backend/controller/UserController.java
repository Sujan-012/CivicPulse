package com.civicpulse.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.civicpulse.backend.dto.AuthResponse;
import com.civicpulse.backend.dto.RegisterRequest;
import com.civicpulse.backend.entity.Role;
import com.civicpulse.backend.entity.User;
import com.civicpulse.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // List all officer accounts (for admin to assign issues to)
    @GetMapping("/officers")
    public ResponseEntity<List<User>> getOfficers() {
        return ResponseEntity.ok(userRepository.findByRole(Role.OFFICER));
    }

    // Admin creates a new officer account
    @PostMapping("/officers")
    public ResponseEntity<AuthResponse> createOfficer(@RequestBody RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.ok(new AuthResponse("Email already exists", false));
        }

        User officer = new User();
        officer.setName(request.getName());
        officer.setEmail(request.getEmail());
        officer.setPassword(passwordEncoder.encode(request.getPassword()));
        officer.setRole(Role.OFFICER);

        userRepository.save(officer);

        return ResponseEntity.ok(new AuthResponse("Officer account created successfully", true));
    }
}
