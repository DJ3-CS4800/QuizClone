package com.CS4800_DJ3.StudyDeckBackend.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.CS4800_DJ3.StudyDeckBackend.DTO.FlashCard;
import com.CS4800_DJ3.StudyDeckBackend.DTO.StudyDeckCreateRequest;
import com.CS4800_DJ3.StudyDeckBackend.DTO.StudyDeckEditRequest;
import com.CS4800_DJ3.StudyDeckBackend.Models.DeckProgress;
import com.CS4800_DJ3.StudyDeckBackend.Models.StudyDeck;
import com.CS4800_DJ3.StudyDeckBackend.Repo.DeckProgressRepo;
import com.CS4800_DJ3.StudyDeckBackend.Repo.StudyDeckRepo;

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
        Long userID = (Long) session.getAttribute("userID");

        if (userID == null)
            return ResponseEntity.ok(Map.of("error", "User not logged in"));

        List<StudyDeck> studyDeckList = studyDeckRepo.findAllByOwnerID(userID);

        return ResponseEntity.ok(Map.of("studyDeckList", studyDeckList));
    }

    public ResponseEntity<?> getDeck(long deckID, HttpSession session) {
        Long currUserID = (Long) session.getAttribute("userID");
        StudyDeck studyDeck = studyDeckRepo.findByDeckID(deckID);
        Boolean isOwner = (currUserID != null && studyDeck.getOwnerID() == currUserID);
        DeckProgress deckProgress = 
            (currUserID != null) ? deckProgressRepo.findByUserIDAndDeckID(currUserID, deckID) : null;

        // Check if deck exists
        if (studyDeck == null) {
            // If deck does not exist, delete progress if exists
            if (!(deckProgress == null)) {
                deckProgressRepo.deleteByUserIDAndDeckID(deckID, deckID);
            }

            return ResponseEntity.ok(Map.of("error", "Deck does not exist"));
        }

        // Check if deck is public or not, if not public, other users cannot access it
        if (!studyDeck.isPublic()) {
            if (currUserID == null || !(studyDeck.getOwnerID() == currUserID)) {
                return ResponseEntity.ok(
                        Map.of(
                                "error",
                                "Deck is set to private, if you are the owner, please login to access it"));
            }
        }

        // Check if deckProgress exists, if not, create it
        if (deckProgress == null) {
            if (currUserID != null) {
                deckProgress = 
                    deckProgressService.copyStudyDeckToProgress(
                        deckID,
                        currUserID,
                        studyDeck);
            } else {
                deckProgress = 
                    deckProgressService.copyStudyDeckToProgressWithoutDB(
                        deckID,
                        studyDeck);
            }
        }

        return ResponseEntity.ok(Map.of(
                "deckName", studyDeck.getDeckName(),
                "deck", deckProgress,
                "owner", isOwner,
                "ownerName", studyDeck.getOwnerName(),
                "trackProgress", currUserID != null));
    }

    public ResponseEntity<?> createDeck(StudyDeckCreateRequest studyDeckCreateRequest, HttpSession session) {
        Long userID = (Long) session.getAttribute("userID");
        String userName = (String) session.getAttribute("username");

        if (userID == null)
            return ResponseEntity.ok(Map.of("error", "User not logged in"));

        // Create new study deck
        StudyDeck studyDeck = new StudyDeck();
        studyDeck.setOwnerID(userID);
        studyDeck.setOwnerName(userName);
        studyDeck.setDeckName(studyDeckCreateRequest.getDeckName());
        studyDeck.setPublic(studyDeckCreateRequest.isPublic());
        studyDeck.setCreatedAt(new Date(Calendar.getInstance().getTime().getTime()));
        studyDeck.setUpdatedAt(new Date(Calendar.getInstance().getTime().getTime()));

        List<FlashCard> content = new ArrayList<>();

        // Add flashcards to the study deck
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

    @Transactional
    public ResponseEntity<?> updateDeck(StudyDeckEditRequest studyDeckEditRequest, Long deckID, HttpSession session) {
        List<FlashCard> content = new ArrayList<>();
        Long userID = (Long) session.getAttribute("userID");
        Boolean anyChange = false;

        if (userID == null)
            return ResponseEntity.ok(
                    Map.of("error", "User not logged in"));

        StudyDeck studyDeck = studyDeckRepo.findByDeckID(deckID);

        if (studyDeck == null)
            return ResponseEntity.ok(
                    Map.of("error", "Deck does not exist"));

        if (studyDeck.getOwnerID() != userID)
            return ResponseEntity.ok(
                    Map.of("error", "You do not own this deck"));

        // Check if user is trying to change any of the following: public, deck name, or content
        if (studyDeck.isPublic() != studyDeckEditRequest.getIsPublic()) {
            studyDeck.setPublic(studyDeckEditRequest.getIsPublic());
            anyChange = true;
        }

        if (!studyDeck.getDeckName().equals(studyDeckEditRequest.getDeckName())) {
            studyDeck.setDeckName(studyDeckEditRequest.getDeckName());
            anyChange = true;
        }

        for (FlashCard request : studyDeckEditRequest.getContent()) {
            FlashCard newCard = new FlashCard();
            newCard.setQuestion(request.getQuestion());
            newCard.setAnswer(request.getAnswer());
            content.add(newCard);
        }

        if (!studyDeck.getContent().equals(content)) {
            studyDeck.setContent(content);
            anyChange = true;
        }

        if (anyChange) {
            studyDeck.setUpdatedAt(new Date(Calendar.getInstance().getTime().getTime()));
        }

        entityManager.merge(studyDeck);

        return ResponseEntity.ok(Map.of("success", "Deck updated"));
    }

    public ResponseEntity<?> deleteDeck(long deckID, HttpSession session) {
        Long userID = (Long) session.getAttribute("userID");

        if (userID == null)
            return ResponseEntity.ok(Map.of("error", "User not logged in"));

        StudyDeck studyDeck = studyDeckRepo.findByDeckID(deckID);

        if (studyDeck == null)
            return ResponseEntity.ok(Map.of("error", "Deck does not exist"));

        if (studyDeck.getOwnerID() != userID)
            return ResponseEntity.ok(Map.of("error", "You do not own this deck"));

        studyDeckRepo.delete(studyDeck);

        return ResponseEntity.ok(Map.of("success", "Deck deleted"));
    }

}
