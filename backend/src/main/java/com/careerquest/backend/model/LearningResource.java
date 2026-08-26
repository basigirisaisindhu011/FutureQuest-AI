package com.careerquest.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "learning_resources")
public class LearningResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "career_id", nullable = false)
    private Long careerId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "difficulty_level", nullable = false)
    private String difficultyLevel; // Beginner, Intermediate, Advanced

    @Column(name = "resource_type", nullable = false)
    private String resourceType; // video, article, activity, challenge

    @Column(name = "external_link")
    private String externalLink;

    public LearningResource() {
    }

    public LearningResource(Long careerId, String title, String description, String difficultyLevel, String resourceType, String externalLink) {
        this.careerId = careerId;
        this.title = title;
        this.description = description;
        this.difficultyLevel = difficultyLevel;
        this.resourceType = resourceType;
        this.externalLink = externalLink;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCareerId() {
        return careerId;
    }

    public void setCareerId(Long careerId) {
        this.careerId = careerId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public String getExternalLink() {
        return externalLink;
    }

    public void setExternalLink(String externalLink) {
        this.externalLink = externalLink;
    }
}
