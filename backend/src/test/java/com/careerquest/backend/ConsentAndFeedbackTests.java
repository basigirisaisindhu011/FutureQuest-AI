package com.careerquest.backend;

import com.careerquest.backend.dto.ChildRegistrationRequest;
import com.careerquest.backend.dto.RegisterRequest;
import com.careerquest.backend.model.ChildProfile;
import com.careerquest.backend.model.ParentChildLink;
import com.careerquest.backend.model.User;
import com.careerquest.backend.repository.ChildProfileRepository;
import com.careerquest.backend.repository.ParentChildLinkRepository;
import com.careerquest.backend.repository.UserRepository;
import com.careerquest.backend.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class ConsentAndFeedbackTests {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChildProfileRepository childProfileRepository;

    @Autowired
    private ParentChildLinkRepository parentChildLinkRepository;

    @Test
    public void testChildDirectRegistrationAndParentLinking() {
        // 1. Child registers independently (No parent permission required)
        ChildRegistrationRequest childReq = new ChildRegistrationRequest();
        childReq.setNickname("Alex");
        childReq.setAvatar("rocket");
        childReq.setAgeGroup("11-13");
        childReq.setPin("1234");

        ChildProfile childProfile = userService.registerChild(childReq);

        assertNotNull(childProfile.getId());
        assertNotNull(childProfile.getPlayerCode());
        assertTrue(childProfile.getPlayerCode().startsWith("CQ"));
        assertEquals("Alex", childProfile.getNickname());

        User childUser = userRepository.findById(childProfile.getUserId()).orElse(null);
        assertNotNull(childUser);
        // Verify child is ACTIVE immediately without parent approval
        assertEquals("ACTIVE", childUser.getAccountStatus());

        // 2. Parent registers separately
        RegisterRequest parentReq = new RegisterRequest();
        parentReq.setUsername("testparent");
        parentReq.setEmail("parent@test.com");
        parentReq.setPassword("password123");
        parentReq.setRole("PARENT");
        User parent = userService.registerUser(parentReq);

        assertNotNull(parent.getId());
        assertEquals("ACTIVE", parent.getAccountStatus());

        // 3. Parent links to child using Child Player Code
        ParentChildLink link = userService.linkChildToParent(parent.getId(), childProfile.getPlayerCode());
        assertNotNull(link);
        assertEquals(parent.getId(), link.getParentId());
        assertEquals(childProfile.getId(), link.getChildProfileId());

        assertTrue(parentChildLinkRepository.existsByParentIdAndChildProfileId(parent.getId(), childProfile.getId()));
    }
}
