package com.CS4800_DJ3.StudyDeckBackend.Service;

import com.CS4800_DJ3.StudyDeckBackend.DTO.ApiResponseDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.DeckProgressUnderstandingLevelEditRequestDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.FlashCardDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.FlashCardWithProgressDTO;
import com.CS4800_DJ3.StudyDeckBackend.DTO.StudyDeckProgressEditRequestDTO;
import com.CS4800_DJ3.StudyDeckBackend.Models.StudyDeck;
import com.CS4800_DJ3.StudyDeckBackend.Models.DeckProgress;
import com.CS4800_DJ3.StudyDeckBackend.Repo.DeckProgressRepo;
import com.CS4800_DJ3.StudyDeckBackend.Util.ResponseUtil;

import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DeckProgressService {

    @Autowired
    private DeckProgressRepo deckProgressRepo;

    
    // update the progress of a deckProgress
    public ResponseEntity<ApiResponseDTO> updateDeckProgress(
            StudyDeckProgressEditRequestDTO studyDeckProgressEditRequest,
            UUID deckID,
            HttpSession session) {

        UUID userID = (UUID) session.getAttribute("userID");
        if (userID == null)
            return ResponseUtil.messsage(HttpStatus.UNAUTHORIZED, "User not logged in.");

        DeckProgress deckProgress = deckProgressRepo.findByUserIDAndDeckID(userID, deckID);
        if (deckProgress == null)
            return ResponseUtil.messsage(HttpStatus.NOT_FOUND, "Deck progress not found.");

        if (studyDeckProgressEditRequest.getContentWithProgress() == null)
            return ResponseUtil.messsage(HttpStatus.BAD_REQUEST, "Content with progress is null.");

        List<FlashCardWithProgressDTO> flashCardsWithProgress = studyDeckProgressEditRequest.getContentWithProgress()
                .stream()
                .map(flashCardWithProgress -> new FlashCardWithProgressDTO(
                        flashCardWithProgress.getCardID(),
                        flashCardWithProgress.getQuestion(),
                        flashCardWithProgress.getAnswer(),
                        flashCardWithProgress.getUnderstandingLevel()))
                .collect(Collectors.toList());

        deckProgress.setContentWithProgress(flashCardsWithProgress);
        deckProgressRepo.save(deckProgress);

        return ResponseUtil.messsage(HttpStatus.OK, "Deck progress updated successfully.");
    }


    // update the understanding level of a deckProgress
    @Transactional
    public ResponseEntity<ApiResponseDTO> updateDeckProgressUnderstandingLevel(
            DeckProgressUnderstandingLevelEditRequestDTO updateReqest,
            UUID deckID,
            HttpSession session) {

        UUID userID = (UUID) session.getAttribute("userID");
        if (userID == null)
            return ResponseUtil.messsage(HttpStatus.UNAUTHORIZED, "User not logged in.");

        DeckProgress deckProgress = deckProgressRepo.findByUserIDAndDeckID(userID, deckID);
        if (deckProgress == null)
            return ResponseUtil.messsage(HttpStatus.NOT_FOUND, "Deck progress not found.");

        List<FlashCardWithProgressDTO> flashCardsWithProgress = deckProgress.getContentWithProgress();
        for (FlashCardWithProgressDTO card : flashCardsWithProgress) {
            if (card.getCardID() == updateReqest.getFlashCardId()) {
                card.setUnderstandingLevel(updateReqest.getUnderstandingLevel());
                break;
            }
        }

        deckProgress.setContentWithProgress(flashCardsWithProgress);
        deckProgressRepo.save(deckProgress);

        return ResponseUtil.messsage(HttpStatus.OK, "Deck progress understanding level updated successfully.");
    }


    // update favorite status of a deckProgress
    @Transactional
    public ResponseEntity<ApiResponseDTO> updateDeckProgressFavoriteStatus(UUID deckID, HttpSession session) {
        UUID userID = (UUID) session.getAttribute("userID");

        if (userID == null) 
            return ResponseUtil.messsage(HttpStatus.UNAUTHORIZED, "User not logged in.");

        DeckProgress deckProgress = deckProgressRepo.findByUserIDAndDeckID(userID, deckID);

        if (deckProgress == null) 
            return ResponseUtil.messsage(HttpStatus.NOT_FOUND, "Deck progress not found.");

        if (deckProgress != null) {
            deckProgress.setIsFavorite(!deckProgress.getIsFavorite());
            deckProgressRepo.save(deckProgress);
        }
        return ResponseUtil.messsage(HttpStatus.OK, "Deck progress favorite status updated successfully.");
    }


    // Copy a study deck to a new deck progress object 
    public DeckProgress studyDeckToProgress(UUID deckID, UUID userID, StudyDeck studyDeck) {
        List<FlashCardWithProgressDTO> flashCardsWithProgress = studyDeck.getContent().stream()
                .map(flashCard -> new FlashCardWithProgressDTO(
                        flashCard.getCardID(),
                        flashCard.getQuestion(),
                        flashCard.getAnswer(),
                        0.0))
                .collect(Collectors.toList());

        DeckProgress deckProgress = new DeckProgress();
        deckProgress.setDeckID(deckID);
        deckProgress.setUserID(userID);
        deckProgress.setIsFavorite(false);
        deckProgress.setLastOpened(new java.sql.Timestamp(System.currentTimeMillis()));
        deckProgress.setContentWithProgress(flashCardsWithProgress);

        if (userID != null){
            deckProgress.setUserID(userID);
            deckProgressRepo.save(deckProgress);
        }

        return deckProgress;
    }


    // Update the content in deckProgress with changes to content in studyDeck,
    // transfer progress
    public DeckProgress updateStudyDeckToProgress(StudyDeck studyDeck, DeckProgress deckProgress) {
        List<FlashCardWithProgressDTO> flashCardsWithProgress = new ArrayList<>();
        int i = 0, j = 0;
    
        List<FlashCardDTO> deckContent = studyDeck.getContent();
        List<FlashCardWithProgressDTO> progressContent = deckProgress.getContentWithProgress();
    
        while (i < deckContent.size() && j < progressContent.size()) {
            FlashCardDTO flashCard = deckContent.get(i);
            FlashCardWithProgressDTO flashCardWithProgress = progressContent.get(j);
    
            if (flashCard.getCardID() == flashCardWithProgress.getCardID()) {
                flashCardsWithProgress.add(new FlashCardWithProgressDTO(
                    flashCard.getCardID(),
                    flashCard.getQuestion(),
                    flashCard.getAnswer(),
                    flashCardWithProgress.getUnderstandingLevel()));
                i++;
                j++;
            } else if (flashCard.getCardID() < flashCardWithProgress.getCardID()) {
                flashCardsWithProgress.add(new FlashCardWithProgressDTO(
                    flashCard.getCardID(),
                    flashCard.getQuestion(),
                    flashCard.getAnswer(),
                    0.0));
                i++;
            } else {
                j++;
            }
        }
    
        // Add remaining new cards
        while (i < deckContent.size()) {
            FlashCardDTO flashCard = deckContent.get(i);
            flashCardsWithProgress.add(new FlashCardWithProgressDTO(
                flashCard.getCardID(),
                flashCard.getQuestion(),
                flashCard.getAnswer(),
                0.0));
            i++;
        }
    
        deckProgress.setContentWithProgress(flashCardsWithProgress);
        return deckProgress;
    }
    


    // update all deckProgress related to a studyDeck
    @Transactional
    public void updateAllStudyDeckToProgress(StudyDeck studyDeck) {
        List<DeckProgress> deckProgressList = deckProgressRepo.findAllByDeckID(studyDeck.getDeckID());
        for (DeckProgress deckProgress : deckProgressList) {
            updateStudyDeckToProgress(studyDeck, deckProgress);
            deckProgressRepo.save(deckProgress);
        }
    }

    // remove a deckProgress related to a studyDeck for a specific user
    @Transactional
    public void removeDeckProgressFromUser(UUID deckID, UUID userID) {
        deckProgressRepo.deleteByUserIDAndDeckID(deckID, userID);
    }


    // remove all deckProgress related to a studyDeck
    @Transactional
    public void removeAllStudyDeckToProgress(StudyDeck studyDeck) {
        List<DeckProgress> deckProgressList = deckProgressRepo.findAllByDeckID(studyDeck.getDeckID());
        for (DeckProgress deckProgress : deckProgressList) {
            deckProgressRepo.delete(deckProgress);
        }
    }


}