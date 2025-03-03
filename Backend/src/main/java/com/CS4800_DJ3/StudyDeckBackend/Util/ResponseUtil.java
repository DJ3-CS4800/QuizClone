package com.CS4800_DJ3.StudyDeckBackend.Util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.CS4800_DJ3.StudyDeckBackend.DTO.ApiResponseDTO;

public class ResponseUtil {
    public static ResponseEntity<ApiResponseDTO> messsage(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(new ApiResponseDTO(message));
    } 
}