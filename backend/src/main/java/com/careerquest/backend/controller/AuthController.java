package com.careerquest.backend.controller;

import com.careerquest.backend.config.JwtTokenProvider;
import com.careerquest.backend.dto.AuthResponse;
import com.careerquest.backend.dto.LoginRequest;
import com.careerquest.backend.dto.RegisterRequest;
import com.careerquest.backend.dto.ChildRegistrationRequest;
import com.careerquest.backend.dto.ChildLoginRequest;
import com.careerquest.backend.model.ChildProfile;
import com.careerquest.backend.repository.ChildProfileRepository;
import com.careerquest.backend.model.User;
import com.careerquest.backend.repository.UserRepository;
import com.careerquest.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final ChildProfileRepository childProfileRepository;

    public AuthController(
            UserService userService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider,
            ChildProfileRepository childProfileRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.childProfileRepository = childProfileRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = userService.registerUser(request);
            String token = tokenProvider.generateToken(user.getUsername(), user.getRole());
            return ResponseEntity.ok(new AuthResponse(
                    token,
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole(),
                    user.getAccountStatus()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .or(() -> userRepository.findByEmail(request.getUsername()))
                .orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid username or password"));
        }

        String token = tokenProvider.generateToken(user.getUsername(), user.getRole());
        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getAccountStatus()
        ));
    }

    @PostMapping("/child/register")
    public ResponseEntity<?> registerChild(@Valid @RequestBody ChildRegistrationRequest request) {
        try {
            ChildProfile profile = userService.registerChild(request);
            User user = userRepository.findById(profile.getUserId()).orElseThrow();
            String token = tokenProvider.generateToken(user.getUsername(), user.getRole());
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("childId", profile.getId());
            response.put("playerCode", profile.getPlayerCode());
            response.put("nickname", profile.getNickname());
            response.put("avatar", profile.getAvatar());
            response.put("ageGroup", profile.getAgeGroup());
            response.put("role", "ROLE_CHILD");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            LOGGER.error("Child registration failed", e);
            return ResponseEntity.badRequest().body(Map.of("message", "Unable to create player profile"));
        }
    }

    @GetMapping("/players")
    public ResponseEntity<?> findPlayers(@RequestParam(defaultValue = "") String name) {
        return ResponseEntity.ok(childProfileRepository.findTop20ByNicknameContainingIgnoreCase(name).stream()
                .map(profile -> {
                    Map<String, Object> player = new HashMap<>();
                    player.put("profileId", profile.getId());
                    player.put("nickname", profile.getNickname());
                    player.put("avatar", profile.getAvatar());
                    player.put("ageGroup", profile.getAgeGroup());
                    player.put("playerCode", profile.getPlayerCode());
                    player.put("level", profile.getLevel());
                    return player;
                }).toList());
    }

    @PostMapping("/child/login")
    public ResponseEntity<?> loginChild(@Valid @RequestBody ChildLoginRequest request) {
        String code = request.getPlayerCode() != null ? request.getPlayerCode().trim().toUpperCase() : "";
        Optional<ChildProfile> profileOpt = childProfileRepository.findByPlayerCode(code);
        
        if (profileOpt.isEmpty()) {
            // Fallback lookup by nickname if player code not provided directly
            profileOpt = childProfileRepository.findTop20ByNicknameContainingIgnoreCase(code).stream().findFirst();
        }

        ChildProfile profile = profileOpt.orElse(null);
        if (profile == null || profile.getPinHash() == null || !passwordEncoder.matches(request.getPin(), profile.getPinHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Player Code or PIN is incorrect"));
        }
        
        User user = userRepository.findById(profile.getUserId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "This player profile is unavailable"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("token", tokenProvider.generateToken(user.getUsername(), user.getRole()));
        response.put("childId", profile.getId());
        response.put("playerCode", profile.getPlayerCode());
        response.put("nickname", profile.getNickname());
        response.put("avatar", profile.getAvatar());
        response.put("ageGroup", profile.getAgeGroup());
        response.put("role", "ROLE_CHILD");
        return ResponseEntity.ok(response);
    }
}
