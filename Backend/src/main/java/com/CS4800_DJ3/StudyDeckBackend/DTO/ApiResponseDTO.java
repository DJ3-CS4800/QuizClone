package com.CS4800_DJ3.StudyDeckBackend.DTO;

import io.swagger.v3.oas.annotations.media.Schema;

public class ApiResponseDTO {
    
    private String message;

    public ApiResponseDTO(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}