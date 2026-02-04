package com.smarthospital.auth.dto;

public class LoginResponse {
    private String token;
    private String email;
    private String name;
    private String role;
    private long expiresIn;

    public LoginResponse() {
    }

    public LoginResponse(String token, String email, String name, String role, long expiresIn) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.role = role;
        this.expiresIn = expiresIn;
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;
        private String email;
        private String name;
        private String role;
        private long expiresIn;

        public Builder token(String token) {
            this.token = token;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder role(String role) {
            this.role = role;
            return this;
        }

        public Builder expiresIn(long expiresIn) {
            this.expiresIn = expiresIn;
            return this;
        }

        public LoginResponse build() {
            return new LoginResponse(token, email, name, role, expiresIn);
        }
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }
}
