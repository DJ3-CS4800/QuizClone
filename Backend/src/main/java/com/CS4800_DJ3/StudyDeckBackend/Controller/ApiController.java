package com.CS4800_DJ3.StudyDeckBackend.Controller;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

import com.CS4800_DJ3.StudyDeckBackend.DTO.*;
import com.CS4800_DJ3.StudyDeckBackend.Models.*;
import com.CS4800_DJ3.StudyDeckBackend.Repo.*;
import com.CS4800_DJ3.StudyDeckBackend.Service.*;

@RestController
@RequestMapping("/api")
public class ApiController {
    private final DeckProgressService deckProgressService;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public ApiController(DeckProgressService deckProgressService) {
        this.deckProgressService = deckProgressService;
    }

    //

    @Autowired
    private AccountRepo accountRepo;

    @Autowired
    private DeckProgressRepo deckProgressRepo;

    @Autowired
    private StudyDeckRepo studyDeckRepo;

    /**
     * API endpoint to login
     * 
     * @param AccountRequest: request body containing username and password
     * @param session:        session object to store user information
     * @return: response entity containing success or error message
     */
    @PostMapping(value = "/login")
    public ResponseEntity<?> login(@RequestBody AccountRequest accountRequest, HttpSession session) {
        String username = accountRequest.getUsername();
        String password = accountRequest.getPassword();

        Account account = accountRepo.findByUsername(username);

        if (account == null) {
            return ResponseEntity.ok(Map.of("error", "User does not exist"));
        }

        if (!account.checkPassword(password)) {
            return ResponseEntity.ok(Map.of("error", "Incorrect password"));
        }

        session.setAttribute("userID", account.getUserID());
        session.setAttribute("username", account.getUsername());

        return ResponseEntity.ok(Map.of("success", "Logged in"));
    }

    /**
     * Create a new account
     * 
     * @param AccountRequest: request body containing username and password
     * @return response entity containing success or error message
     */
    @PostMapping(value = "/createAccount")
    public ResponseEntity<?> createAccount(@RequestBody AccountRequest accountRequest, HttpSession session) {
        String username = accountRequest.getUsername();
        String password = accountRequest.getPassword();

        if (accountRepo.findByUsername(username) != null) {
            return ResponseEntity.ok(Map.of("error", "Username already exists"));
        }

        Account account = new Account();
        account.setUsername(username);
        account.setPassword(password);

        accountRepo.addAccount(account.getUsername(), account.getPassword());

        return ResponseEntity.ok(Map.of("success", "Account created"));
    }

    /**
     * API endpoint to retrieve all decks owned by the user
     * 
     * @param session: session object to store user information
     * @return: response entity containing list of study decks
     */
    @PostMapping(value = "/allDecks")
    public ResponseEntity<?> getAllDecks(HttpSession session) {

        Long userID = (Long) session.getAttribute("userID");

        if (userID == null)
            return ResponseEntity.ok(Map.of("error", "User not logged in"));

        System.out.println("TEST");

        List<StudyDeck> studyDeckList = studyDeckRepo.findAllByOwnerID(userID);

        return ResponseEntity.ok(Map.of("studyDeckList", studyDeckList));
    }

    /**
     * API endpoint to retrieve a specific deck
     * 
     * @param deckSelection: request body containing deckID
     * @return: response entity containing the deck
     */
    @PostMapping(value = "/deck")
    public ResponseEntity<?> getDeck(@RequestBody DeckSelection deckSelection, HttpSession session) {

        StudyDeck studyDeck = studyDeckRepo.findByDeckID(deckSelection.getDeckID());
        Long currUserID = (Long) session.getAttribute("userID");
        boolean isOwner = false;

        // Check if deck exists
        if (studyDeck == null) {
            return ResponseEntity.ok(Map.of("error", "Deck does not exist"));
        }

        // Check if deck is public or not, if not public, other users cannot access it
        if (!studyDeck.isPublic()) {
            if (currUserID == null) {
                return ResponseEntity.ok(
                        Map.of(
                                "error",
                                "Deck is set to private, if you are the owner, please login to access it"));
            }
            if (!(studyDeck.getOwnerID() == currUserID)) {
                return ResponseEntity.ok(Map.of("error", "Deck is set to private"));
            }
        }

        // Check if user has any progress on the deck, if not, create a new progress
        // entry for the user in the deck_progress table
        if (currUserID != null) {
            isOwner = studyDeck.getOwnerID() == ((Long) session.getAttribute("userID"));
            DeckProgress deckProgress = deckProgressRepo.findByUserIDAndDeckID(currUserID, deckSelection.getDeckID());

            if (deckProgress == null) {
                DeckProgress newDeckProgress = deckProgressService.copyStudyDeckToProgress(
                        deckSelection.getDeckID(),
                        currUserID,
                        studyDeck);
                return ResponseEntity.ok(
                        Map.of("deck", newDeckProgress, "owner", isOwner, "trackProgress", true));
            } else {
                return ResponseEntity.ok(
                        Map.of("deck", deckProgress, "owner", isOwner, "trackProgress", true));
            }
        }

        return ResponseEntity.ok(Map.of("deck", studyDeck, "owner", false, "trackProgress", false));
    }

    /**
     * API endpoint to create a new deck
     * 
     * @param StudyDeckCreateRequest: request body containing deck information
     * @param session:                session object to store user information
     * @return response entity containing success or error message
     */
    @PostMapping(value = "/createDeck")
    public ResponseEntity<?> createDeck(@RequestBody StudyDeckCreateRequest studyDeckCreateRequest,
            HttpSession session) {
        Long userID = (Long) session.getAttribute("userID");

        if (userID == null)
            return ResponseEntity.ok(Map.of("error", "User not logged in"));

        StudyDeck studyDeck = new StudyDeck();
        studyDeck.setOwnerID(userID);
        studyDeck.setDeckName(studyDeckCreateRequest.getDeckName());
        studyDeck.setPublic(studyDeckCreateRequest.isPublic());

        List<FlashCard> content = new ArrayList<>();

        for (FlashCard request : studyDeckCreateRequest.getContent()) {
            FlashCard newCard = new FlashCard();
            newCard.setQuestion(request.getQuestion());
            newCard.setAnswer(request.getAnswer());

            content.add(newCard);
        }
        studyDeck.setContent(content);
        studyDeckRepo.save(studyDeck);

        return ResponseEntity.ok(Map.of("success", "Deck created"));
    }

    /**
     * API endpoint to update a deck
     * 
     * @param StudyDeckEditRequest: request body containing deck information
     * @param session:              session object to store user information
     * @return response entity containing success or error message
     */
    @Transactional
    @PostMapping(value = "/updateDeck")
    public ResponseEntity<?> updateDeck(@RequestBody StudyDeckEditRequest studyDeckEditRequest, HttpSession session) {
        Long userID = (Long) session.getAttribute("userID");

        if (userID == null)
            return ResponseEntity.ok(
                    Map.of("error", "User not logged in"));

        StudyDeck studyDeck = studyDeckRepo.findByDeckID(studyDeckEditRequest.getDeckID());

        if (studyDeck == null)
            return ResponseEntity.ok(
                    Map.of("error", "Deck does not exist"));

        if (studyDeck.getOwnerID() != userID)
            return ResponseEntity.ok(
                    Map.of("error", "You do not own this deck"));

        if (studyDeck.isPublic() != studyDeckEditRequest.isPublic()) {
            studyDeckRepo.updatePublic(
                    studyDeck.getDeckID(),
                    studyDeckEditRequest.isPublic());
        }

        if (!studyDeck.getDeckName().equals(studyDeckEditRequest.getDeckName())) {
            studyDeckRepo.updateName(
                    studyDeck.getDeckID(),
                    studyDeckEditRequest.getDeckName());
        }

        List<FlashCard> content = new ArrayList<>();

        for (FlashCard request : studyDeckEditRequest.getContent()) {
            FlashCard newCard = new FlashCard();
            newCard.setQuestion(request.getQuestion());
            newCard.setAnswer(request.getAnswer());
            content.add(newCard);
        }

        if (!studyDeck.getContent().equals(content)) {
            studyDeck.setContent(content);
            entityManager.merge(studyDeck);
        }

        return ResponseEntity.ok(Map.of("success", "Deck updated"));
    }

    /**
     * API endpoint to logout
     * 
     * @param session: session object to store user information
     * @return: response entity containing success or error message
     */
    @PostMapping(value = "/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("success", "Logged out"));
    }

    @PostMapping(value = "/logout")
    public ResponseEntity<?> checkin(HttpSession session) {
        return ResponseEntity.ok(Map.of("success", "Hi there, my name is jonathan"));
    }

}
