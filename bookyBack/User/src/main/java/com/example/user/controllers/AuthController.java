package com.example.user.controllers;

import com.example.user.dtos.ErrorResponse;
import com.example.user.dtos.JwtResponse;
import com.example.user.dtos.LoginRequest;
import com.example.user.dtos.SignupRequest;
import com.example.user.models.ERole;
import com.example.user.models.Role;
import com.example.user.models.User;
import com.example.user.repositories.RoleRepository;
import com.example.user.repositories.UserRepository;
import com.example.user.security.jwt.JwtUtils;
import com.example.user.services.LoginAttemptService;
import com.example.user.services.PasswordValidationService;
import com.example.user.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.*;
import java.util.stream.Collectors;
import java.util.concurrent.TimeUnit;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AuthController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private PasswordValidationService passwordValidationService;

    @Autowired
    private LoginAttemptService loginAttemptService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new JwtResponse(
                    jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    roles
            ));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Login failed", "Invalid username or password"));
        }
    }
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest,
                                          BindingResult bindingResult) {
        // Using logger instead of System.out
        log.info("=== Signup Request ===");
        log.info("Request body: {}", signUpRequest);

        if (bindingResult.hasErrors()) {
            logValidationErrors(bindingResult);
            return buildValidationErrorResponse(bindingResult);
        }

        // Validate password length
        if (signUpRequest.getPassword().length() < 6 ||
                signUpRequest.getPassword().length() > 40) {
            bindingResult.rejectValue("password", "size",
                    "Password must be between 6-40 characters");
            return buildValidationErrorResponse(bindingResult);
        }

        // Check for existing users
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            log.warn("Username already taken: {}", signUpRequest.getUsername());
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("username", "Username is already taken"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            log.warn("Email already in use: {}", signUpRequest.getEmail());
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("email", "Email is already in use"));
        }

        if (!passwordValidationService.validatePassword(signUpRequest.getPassword())) {
            log.warn("Password validation failed for user: {}", signUpRequest.getUsername());
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("password",
                            passwordValidationService.getPasswordRequirements()));
        }

        try {
            // Create and save user with roles
            User user = new User(
                    signUpRequest.getUsername(),
                    signUpRequest.getEmail(),
                    encoder.encode(signUpRequest.getPassword())
            );

            // Automatic role assignment
            user.setRoles(assignUserRoles(signUpRequest.getRoles()));

            User savedUser = userRepository.save(user);
            log.info("User registered successfully: {}", savedUser.getId());

            return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "message", "User registered successfully",
                    "userId", savedUser.getId()
            ));

        } catch (Exception ex) {
            log.error("Registration failed", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "REGISTRATION_FAILED",
                            "message", "An error occurred during registration",
                            "details", ex.getMessage()
                    ));
        }
    }

    private Set<Role> assignUserRoles(Set<String> requestedRoles) {
        Set<Role> roles = new HashSet<>();

        // Default to USER role if none specified
        if (requestedRoles == null || requestedRoles.isEmpty()) {
            roles.add(getRoleFromRepository(ERole.ROLE_USER));
            return roles;
        }

        // Process requested roles
        requestedRoles.forEach(role -> {
            switch (role.toLowerCase()) {
                case "admin":
                    roles.add(getRoleFromRepository(ERole.ROLE_ADMIN));
                    break;
                case "user":
                    roles.add(getRoleFromRepository(ERole.ROLE_USER));
                    break;
                default:
                    throw new RuntimeException("Unsupported role: " + role);
            }
        });

        return roles;
    }

    private Role getRoleFromRepository(ERole roleName) {
        return roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException(roleName + " not found"));
    }

    private void logValidationErrors(BindingResult bindingResult) {
        log.warn("Validation errors found:");
        for (FieldError error : bindingResult.getFieldErrors()) {
            log.warn("{}: {}", error.getField(), error.getDefaultMessage());
        }
    }

    private ResponseEntity<Map<String, String>> buildValidationErrorResponse(BindingResult bindingResult) {
        Map<String, String> errors = new HashMap<>();
        bindingResult.getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }

}
