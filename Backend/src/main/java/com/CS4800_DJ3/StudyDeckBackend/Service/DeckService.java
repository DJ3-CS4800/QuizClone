package com.CS4800_DJ3.StudyDeckBackend.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.CS4800_DJ3.StudyDeckBackend.DTO.ApiResponseDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.FlashCardDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.StudyDeckCreateRequestDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.StudyDeckEditRequestDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.StudyDeckWithProgressDTO;
import com.CS4800_DJ3.StudyDeckBackend.Models.DeckProgress;
import com.CS4800_DJ3.StudyDeckBackend.Models.StudyDeck;
import com.CS4800_DJ3.StudyDeckBackend.Repo.DeckProgressRepo;
import com.CS4800_DJ3.StudyDeckBackend.Repo.StudyDeckRepo;
import com.CS4800_DJ3.StudyDeckBackend.Util.ResponseUtil;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.servlet.http.HttpSession;

@Service
public class DeckService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private DeckProgressService deckProgressService;

    @Autowired
    private DeckProgressRepo deckProgressRepo;

    @Autowired
    private StudyDeckRepo studyDeckRepo;

    public ResponseEntity<?> getAllDecks(HttpSession session) {
        UUID userID = (UUID) session.getAttribute("userID");

        if (userID == null)
            return ResponseUtil.messsage(HttpStatus.UNAUTHORIZED, "User not logged in.");

        // Get all study decks owned by the user
        List<StudyDeckWithProgressDTO> studyDecksList = studyDeckRepo.findDecksWithProgress(userID);

        return ResponseEntity.ok(Map.of("studyDeckList", studyDecksList));
    }

    public ResponseEntity<?> getDeck(UUID deckID, HttpSession session) {
        UUID currUserID = (UUID) session.getAttribute("userID");
        StudyDeck studyDeck = studyDeckRepo.findByDeckID(deckID);

        DeckProgress deckProgress = (currUserID != null) ? deckProgressRepo.findByUserIDAndDeckID(currUserID, deckID)
                : null;

        // Check if deck exists
        if (studyDeck == null) {
            return ResponseUtil.messsage(HttpStatus.NOT_FOUND, "Deck does not exist.");
        }

        Boolean isOwner = (currUserID != null && studyDeck.getOwnerID().equals(currUserID));

        // Check if deck is public or not, if not public, other users cannot access it
        if (!studyDeck.isPublic() && !isOwner) {
            return ResponseUtil.messsage(HttpStatus.UNAUTHORIZED, "Deck is not public.");
        }

        // Check if deckProgress exists, if not, create it
        if (deckProgress == null) {
            deckProgress = deckProgressService.studyDeckToProgress(
                    deckID,
                    currUserID,
                    studyDeck);
        }

        // Update the last opened time
        if (currUserID != null) {
            deckProgress.setLastOpened(new java.sql.Timestamp(System.currentTimeMillis()));
            deckProgressRepo.save(deckProgress);
        }

        return ResponseEntity.ok(Map.of(
                "deckName", studyDeck.getDeckName(),
                "ownerName", studyDeck.getOwnerName(),
                "createdAt", studyDeck.getCreatedAt(),
                "updatedAt", studyDeck.getUpdatedAt(),
                "isPublic", studyDeck.isPublic(),
                "isOwner", isOwner,
                "deckWithProgress", deckProgress,
                "trackProgress", currUserID != null));
    }

    public ResponseEntity<?> createDeck(StudyDeckCreateRequestDTO studyDeckCreateRequest, HttpSession session) {
        UUID userID = (UUID) session.getAttribute("userID");
        String userName = (String) session.getAttribute("username");

        if (userID == null)
            return ResponseUtil.messsage(HttpStatus.UNAUTHORIZED, "User not logged in.");

        // Create new study deck
        StudyDeck studyDeck = new StudyDeck();
        studyDeck.setDeckID(UUID.randomUUID());
        studyDeck.setOwnerID(userID);
        studyDeck.setOwnerName(userName);
        studyDeck.setDeckName(studyDeckCreateRequest.getDeckName());
        studyDeck.setPublic(studyDeckCreateRequest.getIsPublic());
        studyDeck.setCreatedAt(new Date(Calendar.getInstance().getTime().getTime()));
        studyDeck.setUpdatedAt(new Date(Calendar.getInstance().getTime().getTime()));

        List<FlashCardDTO> content = new ArrayList<>();
        int Count = 0;

        // Add flashcards to the study deck
        for (FlashCardDTO request : studyDeckCreateRequest.getContent()) {
            FlashCardDTO newCard = new FlashCardDTO();
            newCard.setCardID(Count++);
            newCard.setQuestion(request.getQuestion());
            newCard.setAnswer(request.getAnswer());

            content.add(newCard);
        }

        // Set the content of the study deck
        studyDeck.setContent(content);
        studyDeckRepo.save(studyDeck);

        // Create a new deck progress object for the user
        deckProgressService.studyDeckToProgress(
                studyDeck.getDeckID(),
                userID,
                studyDeck);

        return ResponseEntity.ok(Map.of("deckID", studyDeck.getDeckID()));
    }

    @Transactional
    public ResponseEntity<ApiResponseDTO> updateDeck(StudyDeckEditRequestDTO studyDeckEditRequest, UUID deckID,
            HttpSession session) {
        List<FlashCardDTO> content = new ArrayList<>();
        UUID userID = (UUID) session.getAttribute("userID");

        // Check if user is logged in
        if (userID == null)
            return ResponseUtil.messsage(HttpStatus.UNAUTHORIZED, "User not logged in.");

        StudyDeck studyDeck = studyDeckRepo.findByDeckID(deckID);

        // Check if deck exists
        if (studyDeck == null)
            return ResponseUtil.messsage(HttpStatus.NOT_FOUND, "Deck does not exist.");

        // Check if user is trying to edit a deck that does not belong to them
        if (!studyDeck.getOwnerID().equals(userID))
            return ResponseUtil.messsage(HttpStatus.UNAUTHORIZED, "You do not own this deck");

        // Check if user is trying to change any of the following: public, deck name, or
        // content
        if (studyDeck.isPublic() != studyDeckEditRequest.getIsPublic()) {
            studyDeck.setPublic(studyDeckEditRequest.getIsPublic());
        }

        if (!studyDeck.getDeckName().equals(studyDeckEditRequest.getDeckName())) {
            studyDeck.setDeckName(studyDeckEditRequest.getDeckName());
        }

        int Count = 0;
        for (FlashCardDTO request : studyDeckEditRequest.getContent()) {
            FlashCardDTO newCard = new FlashCardDTO();
            newCard.setCardID(Count++);
            newCard.setQuestion(request.getQuestion());
            newCard.setAnswer(request.getAnswer());
            content.add(newCard);
        }

        studyDeck.setContent(content);
        deckProgressService.updateAllStudyDeckToProgress(studyDeck);
        studyDeck.setUpdatedAt(new Date(Calendar.getInstance().getTime().getTime()));
        entityManager.merge(studyDeck);
        return ResponseUtil.messsage(HttpStatus.OK, "Deck updated successfully.");

    }

    @Transactional
    public ResponseEntity<ApiResponseDTO> deleteDeck(UUID deckID, HttpSession session) {
        UUID userID = (UUID) session.getAttribute("userID");

        // Check if user is logged in
        if (userID == null)
            return ResponseUtil.messsage(HttpStatus.UNAUTHORIZED, "User not logged in.");

        StudyDeck studyDeck = studyDeckRepo.findByDeckID(deckID);

        // Check if deck exists
        if (studyDeck == null)
            return ResponseUtil.messsage(HttpStatus.NOT_FOUND, "Deck does not exist.");

        // Check if user is trying to delete a deck that does not belong to them only
        // delete the progress
        if (!studyDeck.getOwnerID().equals(userID)) {
            deckProgressService.removeDeckProgressFromUser(studyDeck.getDeckID(), userID);
            return ResponseUtil.messsage(HttpStatus.OK, "Deck progress deleted successfully.");
        }

        // Delete the deck
        studyDeckRepo.delete(studyDeck);
        deckProgressService.removeAllStudyDeckToProgress(studyDeck);

        return ResponseUtil.messsage(HttpStatus.OK, "Deck deleted successfully.");
    }

}
