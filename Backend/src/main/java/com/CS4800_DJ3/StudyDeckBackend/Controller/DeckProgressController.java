package com.CS4800_DJ3.StudyDeckBackend.Controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.CS4800_DJ3.StudyDeckBackend.DTO.DeckProgressUnderstandingLevelEditRequestDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.StudyDeckProgressEditRequestDTO;
import com.CS4800_DJ3.StudyDeckBackend.Service.DeckProgressService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/deckProgress")
public class DeckProgressController {

    @Autowired
    private DeckProgressService deckProgressService;

    @PutMapping("/update/{deckID}")
    @Operation(
        description = "Updates the progress of a study deck for the current user."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Deck progress updated successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - user not logged in"),
        @ApiResponse(responseCode = "404", description = "Deck progress not found"),
    })
    public ResponseEntity<?> updateDeckProgress(
            @PathVariable UUID deckID,  
            @RequestBody StudyDeckProgressEditRequestDTO contentWithProgressEditRequest,
            HttpSession session) {
        return deckProgressService.updateDeckProgress(
            contentWithProgressEditRequest, deckID, session);
    }

    
    @PutMapping("/understanding/{deckID}")
    @Operation(
        description = "Updates the understanding level of a study deck for the current user."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Deck progress updated successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - user not logged in"),
        @ApiResponse(responseCode = "404", description = "Deck progress not found"),
    })
    public ResponseEntity<?> updateDeckProgressUnderstanding(
            @PathVariable UUID deckID,  
            @RequestBody DeckProgressUnderstandingLevelEditRequestDTO deckProgressUnderstandingLevelEditRequestDTO,
            HttpSession session) {
        return deckProgressService.updateDeckProgressUnderstandingLevel(
            deckProgressUnderstandingLevelEditRequestDTO, deckID, session);
    }


    @PutMapping("/favorite/{deckID}")
    @Operation(
        description = "Updates the favorite status of a study deck for the current user."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Deck progress updated successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - user not logged in"),
        @ApiResponse(responseCode = "404", description = "Deck progress not found"),
    })
    public ResponseEntity<?> updateDeckProgressFavorite(
            @PathVariable UUID deckID,  
            HttpSession session) {
        return deckProgressService.updateDeckProgressFavoriteStatus(deckID, session);
    }
}
