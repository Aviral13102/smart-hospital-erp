package com.smarthospital.auth.dto;

public class UserInfo {
    private String id;
    private String email;
    private String name;
    private String role;
    private String department;

    public UserInfo() {
    }

    public UserInfo(String id, String email, String name, String role, String department) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.department = department;
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String email;
        private String name;
        private String role;
        private String department;

        public Builder id(String id) {
            this.id = id;
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

        public Builder department(String department) {
            this.department = department;
            return this;
        }

        public UserInfo build() {
            return new UserInfo(id, email, name, role, department);
        }
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}
