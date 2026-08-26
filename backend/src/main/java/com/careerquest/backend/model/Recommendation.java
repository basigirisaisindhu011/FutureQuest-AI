package com.careerquest.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendations")
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "child_profile_id", nullable = false)
    private Long childProfileId;

    @Column(name = "recommended_domains", columnDefinition = "TEXT", nullable = false)
    private String recommendedDomains; // JSON list

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "generated_date", nullable = false)
    private LocalDateTime generatedDate;

    public Recommendation() {
    }

    public Recommendation(Long childProfileId, String recommendedDomains, String explanation) {
        this.childProfileId = childProfileId;
        this.recommendedDomains = recommendedDomains;
        this.explanation = explanation;
        this.generatedDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getChildProfileId() {
        return childProfileId;
    }

    public void setChildProfileId(Long childProfileId) {
        this.childProfileId = childProfileId;
    }

    public String getRecommendedDomains() {
        return recommendedDomains;
    }

    public void setRecommendedDomains(String recommendedDomains) {
        this.recommendedDomains = recommendedDomains;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public LocalDateTime getGeneratedDate() {
        return generatedDate;
    }

    public void setGeneratedDate(LocalDateTime generatedDate) {
        this.generatedDate = generatedDate;
    }
}
