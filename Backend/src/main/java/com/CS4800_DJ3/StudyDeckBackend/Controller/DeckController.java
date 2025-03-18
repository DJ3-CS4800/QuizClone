package com.CS4800_DJ3.StudyDeckBackend.Controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.CS4800_DJ3.StudyDeckBackend.DTO.ApiResponseDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.StudyDeckCreateRequestDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.StudyDeckEditRequestDTO;
import com.CS4800_DJ3.StudyDeckBackend.Service.DeckService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/deck")
public class DeckController {

    @Autowired
    private DeckService deckService;


    @Operation(
        description = "Retrieves all study decks owned by the current user."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Decks retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - user not logged in"),
    })
    @GetMapping(value = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAllDecks(HttpSession session) {
        return deckService.getAllDecks(session);
    }



    @PostMapping(value = "/create")
    @Operation(
        description = "Creates a new study deck with the given name and description."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Deck created successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - user not logged in"),
    })
    public ResponseEntity<ApiResponseDTO> createDeck(
        @RequestBody StudyDeckCreateRequestDTO studyDeckCreateRequest, 
        HttpSession session) {
        return deckService.createDeck(studyDeckCreateRequest, session);
    }



    @Operation(
        description = "Retrieves the specified study deck by its ID."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Deck retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - user not logged in"),
        @ApiResponse(responseCode = "404", description = "Not found - Deck not found"),
    })
    @GetMapping(value = "/{deckID}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getDeck(@PathVariable UUID deckID, HttpSession session) {
        return deckService.getDeck(deckID, session);
    }



    @PutMapping(value = "/{deckID}")
    @Operation(
        description = "Updates the name and description of the specified study deck."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Deck updated successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - user not logged in or not owner of deck"),
        @ApiResponse(responseCode = "404", description = "Not found - Deck not found"),
    })
    public ResponseEntity<ApiResponseDTO> editDeck(
        @PathVariable UUID deckID, 
        @RequestBody StudyDeckEditRequestDTO studyDeckEditRequest, 
        HttpSession session) {
        return deckService.updateDeck(studyDeckEditRequest, deckID, session);
    }
    
    

    @DeleteMapping(value = "/{deckID}")
    @Operation(
        description = "Deletes the specified study deck."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Deck deleted successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - user not logged in or not owner of deck"),
        @ApiResponse(responseCode = "404", description = "Not found - Deck not found"),
    })
    public ResponseEntity<ApiResponseDTO> deleteDeck(@PathVariable UUID deckID, HttpSession session) {
        return deckService.deleteDeck(deckID, session);
    }
}
