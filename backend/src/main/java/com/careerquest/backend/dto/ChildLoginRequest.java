package com.careerquest.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ChildLoginRequest {
    @NotBlank
    private String playerCode;

    @NotBlank
    @Pattern(regexp = "\\d{4}", message = "PIN must contain exactly 4 digits")
    private String pin;

    public String getPlayerCode() { return playerCode; }
    public void setPlayerCode(String playerCode) { this.playerCode = playerCode; }
    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }
}