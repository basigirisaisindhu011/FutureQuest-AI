package com.careerquest.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "career_info")
public class CareerInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String domain; // Tech, Healthcare, Wildlife, etc.

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    public CareerInfo() {
    }

    public CareerInfo(String name, String domain, String description) {
        this.name = name;
        this.domain = domain;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
