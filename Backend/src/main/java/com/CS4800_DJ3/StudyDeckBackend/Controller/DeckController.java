package com.CS4800_DJ3.StudyDeckBackend.Controller;

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

import com.CS4800_DJ3.StudyDeckBackend.DTO.StudyDeckCreateRequest;
import com.CS4800_DJ3.StudyDeckBackend.DTO.StudyDeckEditRequest;
import com.CS4800_DJ3.StudyDeckBackend.Service.DeckService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/deck")
public class DeckController {

    @Autowired
    private DeckService deckService;

    /**
     * Get all decks for the current user
     * @param session: session object to store user information
     * @return response entity containing list of decks
     */
    @GetMapping(value = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAllDecks(HttpSession session) {
        return deckService.getAllDecks(session);
    }


    /**
     * Create a new deck
     * @param studyDeckCreateRequest: request body containing deck information
     * @param session: session object to store user information
     * @return response entity containing success or error message
     */
    @PostMapping(value = "/create")
    public ResponseEntity<?> createDeck(
        @RequestBody StudyDeckCreateRequest studyDeckCreateRequest, 
        HttpSession session) {
        return deckService.createDeck(studyDeckCreateRequest, session);
    }


    /**
     * Get a specific deck by ID
     * @param deckID: ID of the deck to retrieve
     * @param session: session object to store user information
     * @return response entity containing deck information
     */
    @GetMapping(value = "/{deckID}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getDeck(@PathVariable long deckID, HttpSession session) {
        return deckService.getDeck(deckID, session);
    }


    /**
     * Edit a specific deck by ID
     * @param deckID: ID of the deck to edit
     * @param studyDeckEditRequest: request body containing updated deck information
     * @param session: session object to store user information
     * @return response entity containing success or error message
     */
    @PutMapping(value = "/{deckID}")
    public ResponseEntity<?> editDeck(
        @PathVariable long deckID, 
        @RequestBody StudyDeckEditRequest studyDeckEditRequest, 
        HttpSession session) {
        return deckService.updateDeck(studyDeckEditRequest, deckID, session);
    }
    
    
    /**
     * Delete a specific deck by ID
     * @param deckID: ID of the deck to delete
     * @param session: session object to store user information
     * @return response entity containing success or error message
     */
    @DeleteMapping(value = "/{deckID}")
    public ResponseEntity<?> deleteDeck(@PathVariable long deckID, HttpSession session) {
        return deckService.deleteDeck(deckID, session);
    }
}
