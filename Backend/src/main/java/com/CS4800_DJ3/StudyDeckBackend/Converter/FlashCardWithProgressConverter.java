package com.CS4800_DJ3.StudyDeckBackend.Converter;

import com.CS4800_DJ3.StudyDeckBackend.DTO.FlashCardWithProgress;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.*;
import java.util.List;

@Converter
public class FlashCardWithProgressConverter implements AttributeConverter<List<FlashCardWithProgress>, String> {
    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<FlashCardWithProgress> flashcards) {
        try {
            return mapper.writeValueAsString(flashcards);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("flashcard JSON serialization failed", e);
        }
    }

    @Override
    public List<FlashCardWithProgress> convertToEntityAttribute(String json) {
        try {
            return mapper.readValue(json, new TypeReference<List<FlashCardWithProgress>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("flashcard JSON deserialization failed", e);
        }
    }
}
