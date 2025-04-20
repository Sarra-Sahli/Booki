package com.example.user.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Collections;
import java.util.Set;

@Data
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    private String password;

    private Set<String> roles;

    // Getters and Setters
    public Set<String> getRoles() {
        return this.roles == null ? Collections.singleton("user") : this.roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
} 