package com.civicpulse.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.civicpulse.backend.dto.AuthResponse;
import com.civicpulse.backend.dto.LoginRequest;
import com.civicpulse.backend.dto.RegisterRequest;
import com.civicpulse.backend.entity.Role;
import com.civicpulse.backend.entity.User;
import com.civicpulse.backend.jwt.JwtService;
import com.civicpulse.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse("Email already exists", false);
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // Encrypt Password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Default Role
        user.setRole(Role.USER);

        userRepository.save(user);

        return new AuthResponse("Registration Successful", true);
    }

    public AuthResponse login(LoginRequest request) {

        System.out.println("\n========== LOGIN DEBUG ==========");

        System.out.println("Entered Email: " + request.getEmail());

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            System.out.println("❌ User NOT FOUND");
            return new AuthResponse("User not found", false);
        }

        System.out.println("Database Email : " + user.getEmail());
        System.out.println("Entered Password : " + request.getPassword());
        System.out.println("Stored Password Hash : " + user.getPassword());

        boolean passwordMatch =
                passwordEncoder.matches(request.getPassword(), user.getPassword());

        System.out.println("Password Match : " + passwordMatch);

        if (!passwordMatch) {
            System.out.println("❌ Invalid Password");
            return new AuthResponse("Invalid password", false);
        }

        System.out.println("✅ Password Verified");

        String token = jwtService.generateToken(user.getEmail());

        System.out.println("JWT Generated Successfully");
        System.out.println("========== END LOGIN ==========\n");

        return new AuthResponse(
                "Login Successful",
                true,
                user.getName(),
                user.getEmail(),
                user.getRole(),
                token
        );
    }
}