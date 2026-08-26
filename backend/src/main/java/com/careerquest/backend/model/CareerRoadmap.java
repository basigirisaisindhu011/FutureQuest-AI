package com.careerquest.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "career_roadmaps")
public class CareerRoadmap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "career_id", nullable = false)
    private Long careerId;

    @Column(name = "education_level", nullable = false)
    private String educationLevel; // School Level, Higher Education

    @Column(name = "required_skills", columnDefinition = "TEXT")
    private String requiredSkills; // Comma-separated list

    @Column(name = "recommended_courses", columnDefinition = "TEXT")
    private String recommendedCourses; // Comma-separated list

    @Column(name = "future_opportunities", columnDefinition = "TEXT")
    private String futureOpportunities; // Comma-separated list

    @Column(columnDefinition = "TEXT")
    private String overview;

    public CareerRoadmap() {
    }

    public CareerRoadmap(Long careerId, String educationLevel, String requiredSkills, String recommendedCourses, String futureOpportunities, String overview) {
        this.careerId = careerId;
        this.educationLevel = educationLevel;
        this.requiredSkills = requiredSkills;
        this.recommendedCourses = recommendedCourses;
        this.futureOpportunities = futureOpportunities;
        this.overview = overview;
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

    public String getEducationLevel() {
        return educationLevel;
    }

    public void setEducationLevel(String educationLevel) {
        this.educationLevel = educationLevel;
    }

    public String getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(String requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public String getRecommendedCourses() {
        return recommendedCourses;
    }

    public void setRecommendedCourses(String recommendedCourses) {
        this.recommendedCourses = recommendedCourses;
    }

    public String getFutureOpportunities() {
        return futureOpportunities;
    }

    public void setFutureOpportunities(String futureOpportunities) {
        this.futureOpportunities = futureOpportunities;
    }

    public String getOverview() {
        return overview;
    }

    public void setOverview(String overview) {
        this.overview = overview;
    }
}
