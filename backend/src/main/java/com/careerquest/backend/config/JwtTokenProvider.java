package com.careerquest.backend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long expirationTime;

    public JwtTokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expirationTime,
            @Value("${jwt.key-file:./data/jwt.key}") String keyFile) {
        this.key = Keys.hmacShaKeyFor(loadSecret(secret, keyFile).getBytes(StandardCharsets.UTF_8));
        this.expirationTime = expirationTime;
    }

    private static String loadSecret(String configured, String keyFile) {
        if (configured != null && !configured.isBlank()) return configured;
        try {
            java.nio.file.Path path = java.nio.file.Path.of(keyFile).toAbsolutePath();
            java.nio.file.Files.createDirectories(path.getParent());
            if (!java.nio.file.Files.exists(path)) {
                byte[] bytes = new byte[48];
                new java.security.SecureRandom().nextBytes(bytes);
                try {
                    java.nio.file.Files.writeString(path, java.util.Base64.getEncoder().encodeToString(bytes), java.nio.file.StandardOpenOption.CREATE_NEW);
                } catch (java.nio.file.FileAlreadyExistsException ignored) { /* Another local instance created it. */ }
            }
            return java.nio.file.Files.readString(path).trim();
        } catch (java.io.IOException error) {
            throw new IllegalStateException("Set JWT_SECRET or provide a writable local JWT_KEY_FILE", error);
        }
    }

    public String generateToken(String username, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.get("role", String.class);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }
}
