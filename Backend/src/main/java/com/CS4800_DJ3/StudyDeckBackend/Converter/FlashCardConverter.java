package com.CS4800_DJ3.StudyDeckBackend.Converter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.CS4800_DJ3.StudyDeckBackend.DTO.FlashCard;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;


import jakarta.persistence.*;

import java.util.List;

@Converter
public class FlashCardConverter implements AttributeConverter<List<FlashCard>, String> {
    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<FlashCard> flashcards) {
        try {
            return mapper.writeValueAsString(flashcards);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("flashcard JSON serialization failed", e);
        }
    }

    @Override
    public List<FlashCard> convertToEntityAttribute(String json) {
        try {
            return mapper.readValue(json, new TypeReference<List<FlashCard>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("flashcard JSON deserialization failed", e);
        }
    }
}
