package com.CS4800_DJ3.StudyDeckBackend.Converter;

import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.CS4800_DJ3.StudyDeckBackend.DTO.FlashCardDTO;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class FlashCardConverter implements AttributeConverter<List<FlashCardDTO>, String> {
    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<FlashCardDTO> flashcards) {
        try {
            return mapper.writeValueAsString(flashcards);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("flashcard JSON serialization failed", e);
        }
    }

    @Override
    public List<FlashCardDTO> convertToEntityAttribute(String json) {
        try {
            return mapper.readValue(json, new TypeReference<List<FlashCardDTO>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("flashcard JSON deserialization failed", e);
        }
    }
}
