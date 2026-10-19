package com.careerquest.backend.model;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.LinkedHashMap;
import java.util.Map;

@Converter
public class ActivityEvidenceConverter implements AttributeConverter<Map<String, Object>, String> {
    private static final ObjectMapper JSON = new ObjectMapper();
    @Override public String convertToDatabaseColumn(Map<String, Object> evidence) {
        try { return JSON.writeValueAsString(evidence == null ? Map.of() : evidence); }
        catch (Exception error) { throw new IllegalArgumentException("Invalid activity evidence", error); }
    }
    @Override public Map<String, Object> convertToEntityAttribute(String value) {
        if (value == null || value.isBlank()) return new LinkedHashMap<>();
        try { return JSON.readValue(value, new TypeReference<Map<String, Object>>() {}); }
        catch (Exception error) { throw new IllegalArgumentException("Stored activity evidence is invalid", error); }
    }
}
