package com.careerquest.backend.service;

import com.careerquest.backend.dto.RegisterRequest;
import com.careerquest.backend.dto.ChildProfileRequest;
import com.careerquest.backend.dto.ChildRegistrationRequest;
import com.careerquest.backend.model.ChildProfile;
import com.careerquest.backend.model.ParentChildLink;
import com.careerquest.backend.model.User;
import com.careerquest.backend.repository.ChildProfileRepository;
import com.careerquest.backend.repository.ParentChildLinkRepository;
import com.careerquest.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private static final SecureRandom PLAYER_CODE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final ChildProfileRepository childProfileRepository;
    private final ParentChildLinkRepository parentChildLinkRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    public UserService(
            UserRepository userRepository,
            ChildProfileRepository childProfileRepository,
            ParentChildLinkRepository parentChildLinkRepository,
            PasswordEncoder passwordEncoder,
            NotificationService notificationService) {
        this.userRepository = userRepository;
        this.childProfileRepository = childProfileRepository;
        this.parentChildLinkRepository = parentChildLinkRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationService = notificationService;
    }

    public User registerUser(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        String role = request.getRole() != null ? request.getRole().toUpperCase() : "PARENT";

        // Parents and Admins are always ACTIVE immediately. Children register via simple child flow.
        User user = new User(request.getUsername(), encodedPassword, request.getEmail(), role, "ACTIVE");
        return userRepository.save(user);
    }

    public ChildProfile registerChild(ChildRegistrationRequest request) {
        String nickname = request.getNickname() != null ? request.getNickname().trim() : "Explorer";
        String username = "player_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        
        // Children do not require email, password, or parent details during signup
        User player = userRepository.save(new User(
                username,
                passwordEncoder.encode(UUID.randomUUID().toString()),
                null,
                "CHILD",
                "ACTIVE"));

        ChildProfile profile = new ChildProfile(player.getId(), null);
        profile.setNickname(nickname);
        profile.setAvatar(request.getAvatar() != null ? request.getAvatar() : "rocket");
        profile.setAgeGroup(request.getAgeGroup() != null ? request.getAgeGroup() : "11-13");
        profile.setPlayerCode(generatePlayerCode());
        profile.setPinHash(passwordEncoder.encode(request.getPin() != null ? request.getPin() : "1234"));
        return childProfileRepository.save(profile);
    }

    public ParentChildLink linkChildToParent(Long parentId, String playerCode) {
        if (playerCode == null || playerCode.isBlank()) {
            throw new RuntimeException("Player Code is required");
        }
        String cleanCode = playerCode.trim().toUpperCase();
        ChildProfile childProfile = childProfileRepository.findByPlayerCode(cleanCode)
                .orElseThrow(() -> new RuntimeException("No player found with Code: " + cleanCode));

        if (parentChildLinkRepository.existsByParentIdAndChildProfileId(parentId, childProfile.getId())) {
            throw new RuntimeException("This child is already linked to your parent account.");
        }

        ParentChildLink link = new ParentChildLink(parentId, childProfile.getId());
        ParentChildLink savedLink = parentChildLinkRepository.save(link);

        // Maintain legacy field for smooth query fallbacks
        childProfile.setParentId(parentId);
        childProfileRepository.save(childProfile);

        notificationService.createNotification(
                parentId,
                "Child Linked",
                "Successfully linked player " + childProfile.getNickname() + " (" + cleanCode + ") to your parent account.",
                "INFO"
        );

        return savedLink;
    }

    public ChildProfile createChildProfile(Long parentId, ChildProfileRequest request) {
        ChildRegistrationRequest reg = new ChildRegistrationRequest();
        reg.setNickname(request.getNickname());
        reg.setAvatar(request.getAvatar());
        reg.setAgeGroup(request.getAgeGroup());
        reg.setPin(request.getPin());
        ChildProfile profile = registerChild(reg);
        linkChildToParent(parentId, profile.getPlayerCode());
        return profile;
    }

    public ChildProfile createIndependentPlayer(ChildProfileRequest request) {
        ChildRegistrationRequest reg = new ChildRegistrationRequest();
        reg.setNickname(request.getNickname());
        reg.setAvatar(request.getAvatar());
        reg.setAgeGroup(request.getAgeGroup());
        reg.setPin(request.getPin());
        return registerChild(reg);
    }

    private String generatePlayerCode() {
        String code;
        do {
            code = "CQ" + (1000 + PLAYER_CODE_RANDOM.nextInt(9000));
        } while (childProfileRepository.findByPlayerCode(code).isPresent());
        return code;
    }

    public void resetChildPin(Long parentId, Long childId, String pin) {
        ChildProfile profile = childProfileRepository.findByUserId(childId)
                .orElseThrow(() -> new RuntimeException("Child profile not found"));
        profile.setPinHash(passwordEncoder.encode(pin));
        childProfileRepository.save(profile);
    }
}
