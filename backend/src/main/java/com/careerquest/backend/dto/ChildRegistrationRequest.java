package com.careerquest.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ChildRegistrationRequest {
    @NotBlank
    private String nickname;

    @NotBlank
    private String avatar;

    @NotBlank
    private String ageGroup;

    @NotBlank
    @Pattern(regexp = "\\d{4}", message = "PIN must contain exactly 4 digits")
    private String pin;

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public String getAgeGroup() { return ageGroup; }
    public void setAgeGroup(String ageGroup) { this.ageGroup = ageGroup; }
    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }
}