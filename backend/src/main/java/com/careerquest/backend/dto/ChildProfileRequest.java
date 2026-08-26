package com.careerquest.backend.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ChildProfileRequest {
    @NotBlank
    @Size(min = 2, max = 30)
    private String nickname;

    @Size(max = 30)
    private String avatar;

    @Size(max = 10)
    private String ageGroup;

    @NotBlank
    @Pattern(regexp = "\\d{4}")
    private String pin;

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getAgeGroup() {
        return ageGroup;
    }

    public void setAgeGroup(String ageGroup) {
        this.ageGroup = ageGroup;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }
}